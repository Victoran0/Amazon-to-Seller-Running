
const container = document.getElementById('container')
const content = document.createElement('button')
const content2 = document.createElement('button')
const content3 = document.createElement('button')
const content4 = document.createElement('button')

content.type = 'submit'
content.innerHTML = 'Shipped +'

content4.type = 'submit'
content4.innerHTML = 'Confirmed +'


content2.type = 'submit'
content2.innerHTML = 'Disable'

content3.type = 'submit'
content3.innerHTML = 'EXIT'


container.append(content , content4, content2, content3)


content.addEventListener(('click'), () => {
    chrome.runtime.sendMessage({message: true, url: 'preconfirmed'})
})

content4.addEventListener(('click'), () => {
    chrome.runtime.sendMessage({message: true, url: 'confirmed'})
})

content2.addEventListener(('click'), () => {
    chrome.runtime.sendMessage({message: false})
    window.close()
})

content3.addEventListener(('click'), () => {
    window.close()
})