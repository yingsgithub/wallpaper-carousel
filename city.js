//1. get all the relative dom elements to use for rendering
//2. fetch pics from backend
//3. render the

//***write all the eles first to easy manager them, later when type `objs.` JS can show the rest of the name
let objs = {
    body: null,
    inputCity: null,
    btnSearch: null,
    carousel:null,
    btnPrev: null,
    btnNext: null,
    // preUrl: null
    preUrlStrMethod: null,
    page: {
        cursor: 1,
        total: 1
    }
}
const unsplashKey = 'Xso8B4mu6BiQyGk2GnHMUCz-GHRjY7yaGiT34YHB4DQ'
const strClassSelected = 'selected'

//GET ele BODY TO make pic as background
objs.body = document.querySelector('body')
//get ele input
objs.inputCity = document.querySelector('.searchBar input')
objs.btnSearch = document.querySelector('.searchBar button')
objs.carousel = document.querySelector('.gallery')
objs.btnPrev = document.querySelector('.btnNav.prev')
objs.btnNext = document.querySelector('.btnNav.next')


const setKeyEvent = () => {
    //input set 'keyUp' event: user can press enter  key to get data
    objs.inputCity.addEventListener('keyup', function(evt) {
        //consider user input being valid or same key words entered before
        if (evt.key === 'Enter' && objs.inputCity.value.trim().length) {
            fetchData()
        }
    })
    //to do : add more key event here
    //press left /right key to change page (need to assign to the whole boday)
    objs.body.addEventListener('keyup', function(evt) {
        if(evt.key === 'ArrowLeft') { prevPage()}
        if(evt.key === 'ArrowRight') { nextPage()}
    })

    objs.btnPrev.addEventListener('click', prevPage)
    objs.btnNext.addEventListener('click', nextPage)

}

const prevPage = ()  => {
    if (objs.page.cursor > 1) {
        objs.page.cursor--
        fetchData()
    }
}

const nextPage = ()  => {
    if (objs.page.cursor < objs.page.total) {
        objs.page.cursor++
        fetchData()
    }
}
const fetchData = function () {
    //get user input first while users entering search words,consider invalid input ***
    //***trim()
    //***if user doesn't input any word but clicks search button, 使用默认关键词macbook
    // const newCity = objs.inputCity.value.trim().toLowerCase() || 'macbook'
    const newCity = objs.inputCity.value.trim().toLowerCase()||'macbook'
    console.log('userInput:', newCity)
    fetch(`https://api.unsplash.com/search/photos/?client_id=${unsplashKey}&query=${newCity}&orientation=landscape&page=${objs.page.cursor}`)
        .then(response => response.json())
        .then(function(data){
            console.log('data fetched:', data)
            //to do: 1.render img carousel-background pic 2.carousel
            //***consider if date fetch failed
            renderImages(data.results)
            objs.page.total = data.total_pages
        })
}

const renderImages = function (arrImages) {
    //set background img with the new data got
    const img = arrImages[0].urls.full

    console.log('img url full:',img)
    objs.body.style.background = `url('${img}') no-repeat center center fixed`
    // objs.preUrl = img

    //create carousel
    createCarousel(arrImages)
}

const updateBackgroundImg = (url) => {
    objs.body.style.background = `url('${url}') no-repeat center center fixed`
}

const setImgSelected = (eleImg) => {
    //get all imgs in carousel by data-index property
    let imgs = document.querySelectorAll("[data-index]")
    console.log('imgs with data-index:', imgs)
    imgs.forEach((img) => {
        img.className = ""
    })
    //active css to the selected img
    eleImg.className = strClassSelected
}

const createCarousel = (arrImages) => {
    objs.carousel.innerText = ""
    //***can use forEach
    for (let i = 0; i < arrImages.length; i++) {
        let item = document.createElement('div')
        if (i === 0 ) {
            item.className = strClassSelected
        }
        // item.className = 'imgContainer'
        let img = arrImages[i].urls.regular
        item.style.background = `url('${img}') no-repeat center center fixed`
        item.dataset.index = i

        item.style.animation = 'fadeIn 0.25s forwards'
        item.style.animationDelay = `${0.1 * i}s`

        item.dataset.url = arrImages[i].urls.full
        objs.carousel.appendChild(item)
        item.addEventListener('click',(evt)=>{
            updateBackgroundImg(evt.target.dataset.url)
            //add css to selected carousel img
            setImgSelected(evt.target)// evt.target is the DOM element
            // objs.preUrl = evt.target.dataset.url
            console.log('clicked')
            // ***if not add below code, background img setting by clicked will be effected by mouse hover/leave
            objs.preUrlStrMethod = evt.target.dataset.url
        })

        //when mouse hover temporarily show pic as background
        item.addEventListener('mouseenter', (evt)=> {
            let newUrl = evt.target.dataset.url
            // console.log('mouseenter event:', newUrl)

            //use str methods to temporally store background url before update to a new img
            console.log(objs.body.style.background) //url("http://...")
            if (!objs.preUrlStrMethod) {
                let str = objs.body.style.background
                let startIndex = str.indexOf('"')
                // console.log('startIndex:', startIndex)
                let endIndex = str.indexOf('"', startIndex+1)
                // console.log('endIndex:', endIndex)
                str = str.slice(startIndex+1,endIndex)
                objs.preUrlStrMethod = str
                // console.log('objs.preUrlStrMethod:', objs.preUrlStrMethod)
            }
            updateBackgroundImg(newUrl)

        })

        item.addEventListener('mouseleave', (evt)=> {
            // updateBackgroundImg(objs.preUrl)
            if (objs.preUrlStrMethod) {
            updateBackgroundImg(objs.preUrlStrMethod)
            objs.preUrlStrMethod = null
            }
        })
    }


}

fetchData()
setKeyEvent()

objs.btnSearch.addEventListener('click', fetchData)
