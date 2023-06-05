
const container = document.getElementById('container')
const content = document.createElement('button')
const content2 = document.createElement('button')
const content3 = document.createElement('button')
const content4 = document.createElement('button')

content.classList.add('content')
content.type = 'submit'
content.innerHTML = 'Shipped +'

content4.classList.add('content4')
content.type = 'submit'
content.innerHTML = 'Shipped +'


content2.type = 'submit'
content2.innerHTML = 'Disable'
content2.classList.add('content2')

content3.classList.add('content3')
content3.type = 'submit'
content3.innerHTML = 'EXIT'


container.append(content, content2, content3, content4)


content.addEventListener(('click'), () => {
    chrome.runtime.sendMessage({message: true})
})


content2.addEventListener(('click'), () => {
    chrome.runtime.sendMessage({message: false})
    window.close()
})

content3.addEventListener(('click'), () => {
    window.close()
})