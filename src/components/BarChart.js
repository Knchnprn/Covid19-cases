import { useState ,useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from 'chart.js';
import GetData  from './ApiGetData';
import moment from 'moment'
import './Styles.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
)

function BarChart () {

    const [chartData, setChartData] = useState({
        datasets:[],
    })

    const [data, setData] = useState([]) 
    const [dataAll, setDataAll] =useState([])

    const [chartOptions, setChartOptions] = useState({});
    const [chartDate, setChartDate] = useState([]);  // DateList
    const [date, setDate] =useState('')
    const [countIndex, setCountIndex] = useState(0)
   
    // console.log("data all ",dataAll);
    useEffect(()=> {
       getApiData() 

        setChartOptions({
            responsive:true,
            indexAxis:'y',
            maintainAspectRatio: false,
            scales: {
                 y: {
                    ticks: {
                        font: {size: 15,}
                    }
                },
            }
        })
    },[])
    

    useEffect(() => {

        // find date
        if (data.length > 0) {
            const dateList = Object.keys(data[0].timeline.cases)  
                setChartDate(dateList)

            const countryColor = {}
            for (const item of data) {
                countryColor[item.country] = randomColor() //ct=key:col=value
            }

            // process data
            let saveAllData = []
            for (let index = 0; index < dateList.length ; index++) { //date=key
                
                const date = dateList[index];
                const dataProcess = data.reduce(function(prev,current) 
                    {
                    
                    let countryData = {}
                    countryData[current.country] = {cases : current.timeline.cases[date] , color: countryColor[current.country]}
                    prev[date] = {...prev[date] , ...countryData};
                    
                    return prev;
                    }, []);
               
                let sortable =  Object.fromEntries(
                                Object.entries(dataProcess[date]).sort(([,a],[,b]) => b.cases-a.cases) // sort country from cases
                                );
                let obj = {}
                obj[date] = sortable
                saveAllData.push(obj)    
            }
             setDataAll(saveAllData)

        }
    },[data])

    useEffect(()=>{
        //loop date
        if (chartDate.length > 0) {
              if (countIndex >= chartDate.length-1) {
            setTimeout(()=>{
                setCountIndex(0)
                setDate(chartDate[0])
            },2000)
        } else {
            setTimeout(()=>{
                setCountIndex(countIndex+1)
                setDate(chartDate[countIndex+1])
            },1000)
        }  
        }
    })

    useEffect(() => {

        //data to bar chart
        if (dataAll.length > 0 && date !== ''){
            
        const casesList = []
        const colorList = []
    
        Object.keys(dataAll[countIndex][date]).map(key => {
            
            casesList.push(dataAll[countIndex][date][key].cases)
            colorList.push(dataAll[countIndex][date][key].color)

        })
   
       setChartData(
                    {
                        labels:Object.keys(dataAll[countIndex][date]),
                        datasets:[{
                            label:'Cases',
                            data:casesList,
                            backgroundColor:colorList,
                        }], 
                    }
                )
        }       
    },[dataAll,date]);

    

    const getApiData = async () => {

        const data = await GetData()
        setData(data.data)
    }

    const randomColor = () =>{
        
        const getRgb = () => Math.floor(Math.random() * 256)
        const rgbToHex = (r,g,b) => "#"+[r, g, b].map((x) => {
            const hex = x.toString(16)
            return hex.length === 1 ? "0" + hex:hex;
        }).join("");

        const handleGenerate = () =>{
            const color ={
                r:getRgb(),
                g:getRgb(),
                b:getRgb()
            }
            // setColor(rgbToHex(color.r,color.g,color.b))
            return (rgbToHex(color.r,color.g,color.b))
        }
         return handleGenerate()
    }


    return (

        <>
        <div style={{'textAlign':'center' , 'fontSize':'30px'}}>
            Date : {date !== '' ? moment(date).format('DD/MM/YYYY') : ''}
        </div>
        <div className='chartheight'>
           <Bar options={chartOptions} data={chartData}  /> 
        </div>
        </>
    )

}

export default BarChart;