
let showContent = false

const div = document.querySelector('.main-content')
const btn = document.createElement('button')
const content = document.createElement('button')
const content2 = document.createElement('button')

btn.type = 'submit'
btn.innerHTML = 'Seller </br> Running'
btn.style.position = 'fixed'
btn.style.bottom = '100px'
btn.style.right = '17px'
btn.style.borderRadius = '10px'
btn.style.fontWeight = 'bolder'
btn.style.background = 'rgb(4, 4, 26)'
btn.style.color = 'white'
btn.style.border = '2px solid rgb(4, 4, 26)'
btn.style.cursor = 'pointer'
btn.onmouseover = () => btn.style.border = '3px solid rgb(4, 4, 26)'
btn.onmouseout = () => btn.style.border = '2px solid rgb(4, 4, 26)'


content.type = 'submit'
content.style.display = 'none'
content.style.position = 'fixed'
content.style.bottom = '200px'
content.style.right = '17px'
content.style.borderRadius = '10px'
content.style.cursor = 'pointer'
content.style.color = 'white'
content.style.border = '2px solid rgb(4, 4, 26)'
content.style.background = 'rgb(4, 4, 26)'
content.innerHTML = 'Update Shipping'

content2.innerHTML = 'Disable'
content2.style.display = 'none'
content2.style.position = 'fixed'
content2.style.bottom = '170px'
content2.style.right = '17px'
content2.style.borderRadius = '10px'
content2.style.cursor = 'pointer'
content2.style.color = 'white'
content2.style.border = '2px solid rgb(4, 4, 26)'
content2.style.background = 'rgb(4, 4, 26)'

div.append(btn, content, content2)

btn.addEventListener('click', () => {
    if (!showContent) {
        content.style.display = 'block'
        content2.style.display = 'block'
        showContent = true
    } else {
        content.style.display = 'none'
        content2.style.display = 'none'
        showContent = false
    }
})

content.addEventListener(('click'), () => {
    content.style.display = 'none'; showContent = false
    content2.style.display = 'none'; showContent = false
        chrome.runtime.sendMessage({message: true})
})

content2.addEventListener(('click'), () => {
    content.style.display = 'none'; showContent = false
    content2.style.display = 'none'; showContent = false
        chrome.runtime.sendMessage({message: false})
})
