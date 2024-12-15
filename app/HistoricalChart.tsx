import { LineChart } from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
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
                backgroundColor: '#121212',
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
                propsForBackgroundLines:{
                    stroke: '#262932',
                }
            }}
            bezier
            withVerticalLabels={false}
            withDots={false}
            style={{
                marginVertical: 8,
                paddingHorizontal:8,
                borderRadius: 16,
            }}
        />
    );
}

export default ChartComponent;

