
let showContent = false

const div = document.querySelector('.main-content')
// const btn = document.createElement('button')
const contentDiv = document.createElement('div')
const content = document.createElement('button')
const content2 = document.createElement('button')
const content3 = document.createElement('button')
const img = document.createElement('img')

img.src = chrome.runtime.getURL("assets/icon.jpeg")
img.title = 'seller running to amazon'

contentDiv.classList.add('cscript-content-div')

img.classList.add('cscriptbtn', 'cscript')
div.append(contentDiv, img)

// btn.type = 'submit'
// btn.innerHTML = img

content.classList.add('cscriptbtn1', 'cscript')
content.type = 'submit'
content.innerHTML = 'Shipping +'

content3.classList.add('cscriptbtn3', 'cscript')
content3.type = 'submit'
content3.innerHTML = 'Confirmed +'

content2.classList.add('cscriptbtn2', 'cscript')
content.type = 'submit'
content2.innerHTML = 'Disable'


contentDiv.append(content, content3, content2)

img.addEventListener('click', () => {
    if (!showContent) {
        contentDiv.style.display = 'block'
        showContent = true
    } else {
        contentDiv.style.display = 'none'
        showContent = false
    }
})

content.addEventListener(('click'), () => {
    contentDiv.style.display = 'none'; showContent = false
    chrome.runtime.sendMessage({message: true, url: 'preconfirmed'})
})

content3.addEventListener(('click'), () => {
    contentDiv.style.display = 'none'; showContent = false
    chrome.runtime.sendMessage({message: true, url: 'confirmed'})
})

content2.addEventListener(('click'), () => {
    contentDiv.style.display = 'none'; showContent = false
    chrome.runtime.sendMessage({message: false})
})
