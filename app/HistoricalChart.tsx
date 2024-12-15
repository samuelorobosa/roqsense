import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

function ChartComponent({ chartData }) {
    if (!chartData) return null;

    return (
        <LineChart
            data={chartData}
            width={screenWidth - 40} // Full width minus padding
            height={220}
            chartConfig={{
                backgroundColor: '#1A1E23',
                backgroundGradientFrom: '#1A1E23',
                backgroundGradientTo: '#2A2F36',
                decimalPlaces: 2, // For precision
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                },
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
        />
    );
}

export default ChartComponent;
