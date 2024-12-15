import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
const screenWidth = Dimensions.get('window').width;


function ChartComponent({ chartData }: { chartData: LineChartData }) {
    if (!chartData) return null;

    return (
        <LineChart
            data={chartData}
            width={screenWidth - 40} // Full width minus padding
            height={220}
            chartConfig={{
                backgroundColor: '#ff0000',
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
                paddingHorizontal:8,
                borderRadius: 16,
            }}
        />
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

