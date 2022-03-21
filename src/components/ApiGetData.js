
import axios from 'axios'

let apiGetData= 'https://disease.sh/v3/covid-19/historical?lastdays=30'


async function GetData() {
    const data = await axios.get(apiGetData)
    return data
}

export default GetData;