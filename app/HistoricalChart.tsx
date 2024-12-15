import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// @ts-ignore
function ChartComponent({ chartData }) {
    if (!chartData) return null;

    return (
            <LineChart
                data={chartData}
                width={screenWidth}
                height={300}
                chartConfig={{
                    backgroundColor: '#262932',
                    decimalPlaces: 2, // Number precision
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                        marginHorizontal: 200
                    },
                    fillShadowGradientFrom: 'rgba(39, 100, 255, 0.11)',
                    fillShadowGradientTo: 'rgba(39, 100, 255, 0)',
                }}
                withDots={false}
                withShadow={true}
                withHorizontalLines={false}
                withVerticalLines={false}
                withVerticalLabels={false}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
    );
}

export default ChartComponent;

