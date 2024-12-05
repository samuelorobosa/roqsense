import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../assets/images/roqqu-logo.png')} style={styles.logo} />
                <TouchableOpacity>
                    <Image source={require('../assets/images/Line.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Central Illustration */}
                <Image
                    source={require('../assets/images/mascot2.png')}
                    style={styles.illustration}
                />
                <Text style={styles.helpText}>What can I help with?</Text>

                {/* Action Buttons */}
                <View style={styles.buttonGroup}>
                    {['Who is Roqqu Sensei?', 'Which coin should I invest in?', "What's my networth?", "What's the TON airdrop?"].map((text, index) => (
                        <TouchableOpacity key={index} style={styles.button}>
                            <Text style={styles.buttonText}>{text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Footer Input */}
            <View style={styles.footer}>
                <TextInput style={styles.input} placeholder="Ask anything" placeholderTextColor="#AAA" />
                <TouchableOpacity style={styles.microphoneButton}>
                    <Image source={{ uri: 'https://your-microphone-icon-url.com' }} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark background color
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        backgroundColor: '#242424',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 25,
        marginBottom: 10,
        width: "auto",
        alignItems: 'center',
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
});
