import ollama from 'ollama';

export async function run(dataset)
{
    if(!dataset || dataset.length === 0)
    {
        console.error("Dataset is empty or undefined");
        return;
    }
    var intervals = [], readingsTime = [], readingsDay = [], city = [];
    var batteryTemperature = [], localTemperature = [];
    
    for(let i = 0; i < dataset.length; i++)
    {
        intervals.push(dataset[i].Intervals);
        readingsTime.push(dataset[i].ReadingsTime);
        readingsDay.push(dataset[i].ReadingsDay);
        city.push(dataset[i].City);
        batteryTemperature.push(dataset[i].BatteryTemperature);
        localTemperature.push(dataset[i].LocalTemperature);
    }
    const response = await ollama.chat({
        model: 'mistral',
        messages: [{ role: 'user', content: `Can you predict the ambient 
        temperature for tomorrow using the dataset which has the attributes 
        Intervals of the Day, Timestamp at which readings were taken, 
        Day at which the readings were taken, City in which the local 
        temperature readings were taken and the temperature of the battery of my
        smartphone whose values are ${intervals}, ${readingsTime}, ${readingsDay}, 
        ${city}, ${batteryTemperature}, ${localTemperature} respectively. The output
        should be in the format {predicted°C} temperature}` }]
      })
      
    console.log(response.message.content)
    const result = response.message.content;
    const match = result.match(/([\d.]+)°C/);

    if(match)
        console.log("Ambient Temperature:", match[1],"°C");
    else
        console.log("No match found");
}
