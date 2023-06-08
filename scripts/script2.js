

const fetchData = async () => {
    let obj = {}
    await chrome.storage.local.get(['key']).then((result) => {
        obj = JSON.parse(result.key)
    });
    return obj
}

const clickTrackPackage = async () => {
    const data = await fetchData()

    const trackPackageSpan = document.querySelector('.a-button.a-button-primary.track-package-button')
    let trackPackageLink;
    if (trackPackageSpan) {
        trackPackageLink = trackPackageSpan.getElementsByTagName('a')[0]
    }

    const bdi = document.getElementsByTagName('bdi')[0]
    const orderId = bdi.textContent

    const div = document.querySelector('.a-row.shipment-top-row.js-shipment-info-container')
    const status = div.getElementsByTagName('span')[0]
    const statusText = status.textContent.split('\n')[1].trim().split(' ')[0]

    if (data[orderId]['isShipped']) {
        if (statusText === 'Delivered') {
            data[orderId]['isDelivered'] = true
            chrome.storage.local.set({key: JSON.stringify(data)})
            
            window.open(`https://app.sellerrunning.com/orders/${data[orderId]['orderNum']}`)
        }
        window.close()
    } else {
        trackPackageLink.click()
    }

}

const getPackageDetails = async (url) => {
    const carrierEle = document.getElementsByClassName('a-spacing-small')[0]
    const trackingEle = document.querySelector('.pt-delivery-card-trackingId')

    if (trackingEle !== null) {
        const data = await fetchData()
        const carrier = carrierEle.textContent.split(' with ')[1]
        const trackingId = trackingEle.textContent.split(': ')[1]
        const orderId = url.split('orderId=')[1].split('&')[0]
        
        data[orderId]['isShipped'] = true
        data[orderId]['trackingURL'] = url
        data[orderId]['carrier'] = carrier
        data[orderId]['trackingId'] = trackingId

        chrome.storage.local.set({key: JSON.stringify(data)})
        
        window.open(`https://app.sellerrunning.com/orders/${data[orderId]['orderNum']}`)
    }
    window.close()
}


chrome.runtime.onMessage.addListener((obj, sender, request) => {
    if (obj.message === 'click track package') {
        clickTrackPackage()
    }   

    if (obj.message === 'tracking page') {
        getPackageDetails(obj.url)
    }   
})
