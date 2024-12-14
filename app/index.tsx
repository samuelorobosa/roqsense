import React, {useState, useRef, useEffect} from 'react';
import {View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import EventSource from "react-native-sse";
import { Animated } from 'react-native';



export default function App() {
    const [prompt, setPrompt] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const [conversation, setConversation] = useState<{ id: number; type: string; content: string; isStreaming?: boolean }[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

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
            const es = new EventSource('http://localhost:8000/api/v1/chat', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    message: customPrompt? customPrompt :prompt,
                    thread_id: "agsuw"
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
                        // Finalize the streaming message
                        setConversation(prevConversation => {
                            const updatedConversation = [...prevConversation];
                            const lastMessageIndex = updatedConversation.length - 1;

                            updatedConversation[lastMessageIndex] = {
                                ...updatedConversation[lastMessageIndex],
                                isStreaming: false
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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../assets/images/roqqu-logo.png')} style={styles.logo} />
                <TouchableOpacity>
                    <Image source={require('../assets/images/Line.png')} style={styles.icon} />
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
                            {['Who is Roqqu Sensei?', 'Which coin should I invest in?', "What's my networth?", "What's the TON airdrop?"].map((text, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.button}
                                    onPress={() => {
                                        // setPrompt(text);
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
                        <View key={message.id} style={[
                            styles.messageContainer,
                            message.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer
                        ]}>
                            <Text style={[
                                styles.messageText,
                                message.type === 'user' ? styles.userMessageText : styles.aiMessageText
                            ]}>
                                {message.content}
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
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Footer Input */}
            <View style={styles.footer}>
                <TextInput
                    value={prompt}
                    onChange={e => setPrompt(e.nativeEvent.text)}
                    style={styles.input}
                    placeholder="Ask anything"
                    placeholderTextColor="#AAA"
                    editable={!isStreaming}
                />
                <TouchableOpacity
                    onPress={() => startStream()}
                    style={styles.microphoneButton}
                    disabled={isStreaming || prompt.trim() === ''}
                >
                    <Image source={{ uri: 'https://your-microphone-icon-url.com' }} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    conversationContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#1C2127',
        maxWidth: '85%',
        padding: 14,
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
        fontWeight: 400,
        lineHeight: 20
    },
    aiMessageText: {
        color: '#DDD',
        fontFamily: "Inter",
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 20
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
        width: 24,
        height: 24,
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#242424',
        borderRadius: 25,
        paddingHorizontal: 20,
        color: '#FFF',
        marginRight: 10,
    },
    microphoneButton: {
        backgroundColor: '#5A5A5A',
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
