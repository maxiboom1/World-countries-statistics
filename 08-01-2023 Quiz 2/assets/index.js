
$(document).ready(function () {

const API = {
    getAllData:'https://restcountries.com/v3.1/all',
    getFilteredData:'https://restcountries.com/v3.1/name/',
}
$('#root').hide();

$(".getAllBtn").click(getAllCountries);

$(".searchBtn").click(() => {
    const searchValue = $('.searchString').val(); // Get value from input field
    searchSpecificCountries(searchValue);
});

async function getAllCountries(){
    const countries = await fetchData(API.getAllData);
    
    // We handle errors with code 300 and above
    if(countries.status > 300){
        console.error(countries.status, countries.message)
        alert (`Error: ${countries.status} \nServer response was: ${countries.message}\nTry enter other search sequence`);
    } else{
        render(countries);
    }
    
}

async function searchSpecificCountries(searchValue){
    const countries = await fetchData(API.getFilteredData + searchValue);
    
    // We handle errors with code 300 and above
    if(countries.status > 300){
        console.error(countries.status, countries.message)
        alert (`Error: ${countries.status} \nServer response was: ${countries.message}\nTry enter other search sequence`);
    } else{
        render(countries);
    }
    
}

async function fetchData(url){
    try{
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }catch(error){
        return error;
    }

}

function render(countries){
    renderStatistics(countries);
    renderTable1(countries);
    renderTable2(countries);
    renderTable3(countries);
    $('#root').show();
}

function renderStatistics (countries){
    
    const totalCountries = countries.length;
    const totalPopulation = countries.reduce((total,country) => {return total + country.population}, 0);
    averagePopulation = totalPopulation / totalCountries;
    $('#totalCountries').html('').html('Total countries: ' + totalCountries);
    $('#totalPopulation').html('').html('Total countries Population: ' + totalPopulation);
    $('#averagePopulation').html('').html('Average Population: ' + averagePopulation);

}

function renderTable1(countries){
    $('#countriesTable').html(''); // Clear table at start

    for(const country of countries){
        const tr = `
        <tr>
            <td>${country.name.common}</td>
            <td>${country.population}</td>
        </tr>`;
        $('#countriesTable').append(tr);
    }
}

function renderTable2(countries){
    $('#regionTable').html(''); // Clear table at start
    const data = regionCalc(countries);
    
    //Object iteration
    Object.keys(data).forEach((region) => {
        const tr = `
        <tr>
            <td>${region}</td>
            <td>${data[region]}</td>
        </tr>`;
        $('#regionTable').append(tr);
    });

}

function renderTable3(countries){
    $('#currencyTable').html(''); // Clear table at start
    const data = currencyCalc(countries);
    
    //Object iteration
    Object.keys(data).forEach((currency) => {
        const tr = `
        <tr>
            <td>${currency}</td>
            <td>${data[currency]}</td>
        </tr>`;
        $('#currencyTable').append(tr);
    });
}

function regionCalc(countries){  

    const resultData = {}; // Here we build key:value pairs database
    
    for(let i =0; i<countries.length; i++){
        
        const key = countries[i].region;

        if(typeof resultData[key] == 'undefined'){
            resultData[key] = 1;
        }else{
            resultData[key] += 1;
        }

    }
    return resultData;
}

function currencyCalc(countries){  

    const resultData = {}; // Here we build key:value pairs database
    console.log(countries);
    for(let i=0; i<countries.length; i++){
        
        const currencyObj = countries[i].currencies; // Sub-object it first
        console.log(currencyObj);
        if(currencyObj == undefined){continue;} // In Antartica no currency - so handle the undefine and skip.
    
        // We use it because we don't know currency key name - so using 'values' method we can traverse object like it was array
        const key = Object.values(currencyObj)[0].name; 
          
        if(typeof resultData[key] == 'undefined'){
            resultData[key] = 1;
        }else{
            resultData[key] += 1;
        }

    }
    return resultData;
}


});