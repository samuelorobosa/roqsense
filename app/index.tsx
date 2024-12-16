import React, {useState, useRef, useEffect} from 'react';
import {KeyboardAvoidingView, Platform, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import EventSource from "react-native-sse";
import { Animated } from 'react-native';
import { LinearGradient as AnimatedLinearGradient } from 'expo-linear-gradient';


import uuid from 'react-native-uuid';
import Markdown from 'react-native-markdown-display';
import ChartComponent from "@/app/HistoricalChart";

export default function App() {
    const [prompt, setPrompt] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const [conversation, setConversation] = useState<{ id: number; type: string; content: string; isStreaming?: boolean; chartData?: any }[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [threadId, setThreadId] = useState(uuid.v4());

    const startStream = (customPrompt?: string) => {
        // Immediately add user message to conversation
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: customPrompt? customPrompt : prompt
        };

        // Add user message to conversation
        setConversation(prevConversation => [...prevConversation, userMessage]);

        // Prepare for AI response
        const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: '',
            isStreaming: true
        };
        setConversation(prevConversation => [...prevConversation, aiMessage]);
        setIsStreaming(true);

        try {
            const es = new EventSource('https://roqsense-be-1.onrender.com/api/v1/chat', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    message: customPrompt? customPrompt : prompt,
                    thread_id: threadId,
                }),
                pollingInterval: 0,
            });

            es.addEventListener('message', (event) => {
                try {
                    if (event.data) {
                        const data = JSON.parse(event.data);

                    if (data.status === 'streaming') {
                        // Update the last AI message (which is streaming)
                        setConversation(prevConversation => {
                            const updatedConversation = [...prevConversation];
                            const lastMessageIndex = updatedConversation.length - 1;

                            updatedConversation[lastMessageIndex] = {
                                ...updatedConversation[lastMessageIndex],
                                content: updatedConversation[lastMessageIndex].content + (data.chunk || '')
                            };

                            return updatedConversation;
                        });
                    }
                    else if (data.status === 'success') {
                        let historicalData;
                        let chartData: { labels: string[]; datasets: { data: number[]; color: (opacity: number) => string; strokeWidth: number }[] } | undefined = undefined
                        
                        if(data?.data?.historic_data){
                             // Parse the historical data for rendering
                            historicalData = data.data.historic_data[0].data.map((item: [number, number, number, number, number]) => ({
                                time: new Date(item[0]).toLocaleDateString(), // Convert timestamp to readable date
                                price: parseFloat(item[4].toString()), // Closing price
                            }));

                            chartData = {
                                labels: historicalData.map((entry: { time: string; price: number }) => entry.time),
                                datasets: [
                                    {
                                        data: historicalData.map((entry: { time: string; price: number }) => entry.price),
                                        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Line color
                                        strokeWidth: 2, // Line thickness
                                    },
                                ],
                            };
                        }

                        setConversation(prevConversation => {
                            const updatedConversation = [...prevConversation];
                            const lastMessageIndex = updatedConversation.length - 1;

                            // Append the chart data message
                            updatedConversation[lastMessageIndex] = {
                                ...updatedConversation[lastMessageIndex],
                                isStreaming: false,
                                ...(chartData && { chartData: chartData })
                            };

                            return updatedConversation;
                        });

                        setIsStreaming(false);
                        es.close();
                    }
                    else if (data.status === 'error') {
                        // Handle errors
                        setConversation(prevConversation => {
                            const updatedConversation = [...prevConversation];
                            const lastMessageIndex = updatedConversation.length - 1;

                            updatedConversation[lastMessageIndex] = {
                                ...updatedConversation[lastMessageIndex],
                                content: data.error || 'An unexpected error occurred',
                                isStreaming: false,
                                type: 'error'
                            };

                            return updatedConversation;
                        });

                        setIsStreaming(false);
                        es.close();
                    }
                    }
                } catch (parseError) {
                    console.error('Error parsing event data:', parseError);
                }
            });

            // Clear input after sending
            setPrompt('');

        } catch (error) {
            console.log('Error initializing stream', error);
            setIsStreaming(false);
        }
    };

    // Create an Animated value for the pulse effect
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const gradientAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Create an infinite pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000, // 1 second for full pulse cycle
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [isStreaming]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(gradientAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(gradientAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                })
            ])
        ).start();
    }, [gradientAnim]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../assets/images/roqqu-logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={() => {
                    //Create a new thread Id and start a new conversation
                    setThreadId(uuid.v4());
                    setConversation([]);
                    setIsStreaming(false);
                }}>
                    <Image source={require('../assets/images/newChat.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>

            {/* Conversation View */}
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}
            >
                {conversation.length === 0 ? (
                    <View style={styles.mainContent}>
                        <Image
                            source={require('../assets/images/mascot2.png')}
                            style={styles.illustration}
                        />
                        <Text style={styles.helpText}>What can I help with?</Text>

                        <View style={styles.buttonGroup}>
                            {['Who is Zeus?', 'Which asset should I invest in?', "What's my networth?", "What's the TON airdrop?"].map((text, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.button}
                                    onPress={() => {
                                        startStream(text);
                                    }}
                                >
                                    <Text style={styles.buttonText}>{text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                       
                    </View>
                ) : (
                    conversation.map((message, index) => (
                        <View
                            key={message.id}
                            style={[
                                styles.messageContainer,
                                message.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    message.type === 'user' ? styles.userMessageText : styles.aiMessageText,
                                ]}
                            >
                                <Markdown
                                style={{
                                text: {
                                    color: message.type === 'user' ? '#FFF' : '#DDD',
                                    lineHeight: 22
                                },
                                }}>
                                    {message.content}
                                </Markdown>

                                {message.isStreaming && (
                                    <Animated.Image
                                        source={require('../assets/images/Loader.png')}
                                        style={[
                                            styles.loader,
                                            {
                                                opacity: pulseAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.3, 1]
                                                }),
                                                transform: [
                                                    {
                                                        scale: pulseAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0.8, 1.2]
                                                        })
                                                    }
                                                ]
                                            }
                                        ]}
                                    />
                                )}
                            </Text>
                            {message?.chartData && <ChartComponent chartData={message?.chartData} />}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Footer Input */}
            <View style={styles.footer}>
                <Animated.View style={{ 
                    ...StyleSheet.absoluteFillObject, 
                    borderRadius: 20,
                    transform: [
                        {
                            translateX: gradientAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1]
                            })
                        }
                    ]
                }}>
                    <AnimatedLinearGradient
                        // Colors for the gradient
                        colors={['#D6FBE9', '#FFDEF1', '#747D98']}
                        // Start point of the gradient (optional)
                        start={{ x: 0, y: 0 }}
                        // End point of the gradient (optional)
                        end={{ x: 0, y: 1 }}
                        // Style the gradient container
                        style={{ 
                            ...StyleSheet.absoluteFillObject, 
                            borderRadius: 20 
                        }}
                    />
                </Animated.View>
                <View style={styles.footerInputContainer}>
                    {/* Your content goes here */}
                    <TextInput
                        value={prompt}
                        onChange={e => setPrompt(e.nativeEvent.text)}
                        style={styles.input}
                        placeholder="Ask anything"
                        placeholderTextColor="#AAA"
                        editable={!isStreaming}
                    />
                    <TouchableOpacity onPress={() => {
                        startStream()
                        }}
                        disabled={isStreaming || prompt.trim() === ''}
                    >
                        <Image source={require('../assets/images/SendBtn.png')} style={styles.send} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 10,
        paddingTop: 40,
    },
    conversationContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messageContainer: {
        marginVertical: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#1C2127',
        maxWidth: '85%',
        padding: 8,
        paddingHorizontal: 14
    },
    aiMessageContainer: {
        alignSelf: 'flex-start',
        maxWidth: '95%',
    },
    messageText: {
        fontSize: 14,
    },
    userMessageText: {
        color: '#FFF',
        fontFamily: "Inter",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20
    },
    aiMessageText: {
        color: '#DDD',
        fontFamily: "Inter",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 24
    },
    streamingIndicator: {
        color: '#AAA',
        marginTop: 5,
        fontStyle: 'italic',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    logo: {
        width: 84,
        height: 20,
        resizeMode: 'contain',
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    send: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '50%',
    },
    illustration: {
        width: 164,
        height: 114,
        marginBottom: 24,
    },
    helpText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonGroup: {
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: 8,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#2A2F36',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 10,
        width: "auto",
        alignItems: 'center',
        borderColor: '#FFF',
        borderWidth: 0.2,
        borderStyle: 'solid',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 12,
    },
    footer: {
        height: 70, 
        borderWidth: 2, 
        borderColor: 'transparent', 
        overflow: 'hidden',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: { width: 0, height: 1.204 },
        shadowOpacity: 1,
        shadowRadius: 4.814,
        // elevation: 4,
        padding: 1,
    },
    footerInputContainer: {
        flex: 1, 
        backgroundColor: '#121212', 
        borderRadius: 18, 
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#121212',
        borderRadius: 25,
        paddingHorizontal: 20,
        color: '#FFF',
        marginRight: 10,
    },
    microphoneButton: {
        backgroundColor: 'linear-gradient(180deg, #D6FBE9 0%, #FFDEF1 50%, #747D98 100%)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        paddingHorizontal: 0,
        paddingVertical: 5,
        marginVertical: 5,
    },
    loader: {
        width: 20,
        height: 20,
        opacity: 0.5,
        transform: [{ scale: 0.8 }],
        // padding: 10
    },
});
