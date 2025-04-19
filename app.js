// ! Selectors
const form = document.querySelector("form")
const input = document.querySelector("form input")
const cardContainer = document.getElementById("card-container")
const alertMessage = document.getElementById("alert")
const langBtn = document.querySelector(".language")

// ! Location Find
const locate = document.getElementById("locate")
const locationDiv = document.getElementById("userLocation")
let userLocation = false //for sending user location to left side

// ! Variables
// const API_KEY = "e17c897aa935921a081cf75bcd4fb9e2"
const API_KEY = ${{ secrets.API_KEY }}
let url;
let unit = 'metric'

let isYourLocation;
let cityNames = []
let lang = 'en'



// ! Search by name 
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const city = input.value

    if(city!==''){
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}&lang=${lang}`

        getWeatherData()
    }
    form.reset()   
})

//! Location find
locate.addEventListener("click",(e)=>{
    navigator.geolocation?.getCurrentPosition(({coords})=>{
        const {latitude, longitude} = coords
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}&lang=${lang}`

        userLocation = true
        isYourLocation = true
        
        getWeatherData()
        isYourLocation = false
    })
})


// ! Search by language
langBtn.addEventListener('click',(e)=>{
    if(e.target.textContent == 'RU'){
        input.setAttribute("placeholder","Поиск города")
        lang ='ru'

    }else if(e.target.textContent == 'EN'){
        input.setAttribute("placeholder","Search for a city")
        lang = 'en'
    }
    cardContainer.innerHTML = ''
    locationDiv.innerHTML = ''
    cityNames=[]

})


//! FUNCTIONS
const getWeatherData = async()=>{
    try{
        const res = await fetch(url)
        
        if(!res.ok){    
            throw new Error(`${res.status}`)
        }
        const data = await res.json()

        showOnScreen(data)

    }catch(error){
        if(lang=='ru'){
            Swal.fire({
                title: "Введенный город не найден 😢",
                icon: "warning"
            });
        }else{
            Swal.fire({
                title: "Entered city did not found 😢",
                icon: "warning"
            });
        }
    }
}

// ! remove cities
cardContainer.addEventListener("click",(e)=>{
    if(e.target.className ==='bi bi-x-circle'){
        const cityBlock = e.target.closest(".col")
        cityNames = cityNames.filter((city)=>city!==cityBlock.getAttribute("id"))
        cityBlock.remove()
    }
})

const showOnScreen = ({main,name,weather,sys})=>{
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png` //^ openweathermap.org 

    if(cityNames.indexOf(name) == -1){
        cityNames.unshift(name)
        let card =`
            <div class="col" id="${name}">
                <div class="card mb-4 rounded-3 shadow-sm">
                    
                    <ul class="list-unstyled mt-2 mb-4">
                        
                        <li class="text-end me-2"><i class="bi bi-x-circle"></i></li>
                        ${isYourLocation ? '<h4>Your Location</h4>' : ''}
                        <h4 class="my-0 fw-normal">
                            ${name} <span ><sup>
                            <img src="https://flagsapi.com/${sys.country}/shiny/24.png" class="rounded-circle" alt=${sys.country}/> </sup></span>
                        </h4>
                        <h1 class="card-title pricing-card-title">
                            <i class="bi bi-thermometer-half"></i> ${Math.round(main.temp)}<sup>°C</sup>
                        </h1>
                        <h6 class="card-title pricing-card-title">
                            Min : ${Math.round(main.temp_min)}<sup>°C</sup> - Max : ${Math.round(main.temp_max)}<sup>°C</sup>  
                        </h6>
                        <h6 class="card-title pricing-card-title">
                            <img src="./images/wi-barometer.svg" height="30px"/>${main.pressure} <img src="./images/wi-humidity.svg" height="30px"/>${main.humidity} 
                        </h6>
                        <li>
                            <img src="${iconUrl}"/>
                        </li>
                        <li>${weather[0].description.toUpperCase()}</li>
                    </ul>
                </div>
            </div>
        `

        if(userLocation){
            locationDiv.innerHTML = card
            userLocation = false
        }else{
            cardContainer.innerHTML = card + cardContainer.innerHTML
        }
        
    }
    else{
        alertMessage.classList.replace("d-none","d-block")

        // 
        if(lang=='ru'){
            alertMessage.textContent = `Вы уже знаете погоду в ${name}, пожалуйста, найдите другой город 😉`
        }else{
             alertMessage.textContent = `You already know the weather for ${name}, Please search for another city 😉`
        }
       

        setTimeout(()=>{
            alertMessage.classList.replace("d-block","d-none")
        },3000)
    }
}

