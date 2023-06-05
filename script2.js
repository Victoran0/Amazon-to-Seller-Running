

const fetchData = async () => {
    let obj = {}
    await chrome.storage.local.get(['key']).then((result) => {
        obj = JSON.parse(result.key)
    });
    return obj
}


// THE function that handles clicking the track package
const clickTrackPackage = () => {
    const trackPackageSpan = document.querySelector('.a-button.a-button-primary.track-package-button')
    const trackPackageLink = trackPackageSpan.getElementsByTagName('a')[0]
    trackPackageLink.click()

    console.log('trackPackageSpan:', trackPackageSpan, 'trackPackageLink:', trackPackageLink)
}

// function that handles getting the order url, carrier and trackindID also getting and updating their values in the chrome storage. also opens the order page in seller running

// url can be gotten from the background or from the windoe.location.href
const getPackageDetails = async (url) => {
    const carrierEle = document.getElementsByClassName('a-spacing-small')[0]
    const trackingEle = document.querySelector('.pt-delivery-card-trackingId')

    console.log('carrierEle;', carrierEle, 'trackingEle:', trackingEle)

    if (trackingEle !== null) {
        const data = await fetchData()
        const carrier = carrierEle.textContent.split(' ')[2]
        const trackingId = trackingEle.textContent.split(': ')[1]
        const orderId = url.split('orderId=')[1].split('&')[0]


        console.log('trackingURL:', url, 'carrier:', carrier, 'trackingId:', trackingId, 'data:', data, 'orderId:', orderId)
        
        data[orderId]['isShipped'] = true
        data[orderId]['trackingURL'] = url
        data[orderId]['carrier'] = carrier
        data[orderId]['trackingId'] = trackingId

        chrome.storage.local.set({key: JSON.stringify(data)}).then(() => {
            console.log('RESENT DATA:', JSON.stringify(data))
        })
        window.open(`https://app.sellerrunning.com/orders/${data[orderId]['orderNum']}`)
    } else {
        return
    }
}

// orderDetails[orderId] = {
//     'isShipped': false,
//     'orderNum': orderNum,
//     'carrier': '',
//     'trackingId': '',
//     'trackingURL': ''
// }


chrome.runtime.onMessage.addListener((obj, sender, request) => {
    if (obj.message === 'click track package') {
        clickTrackPackage()
    }   

    if (obj.message === 'tracking page') {
        getPackageDetails(obj.url)
        console.log('url:', obj.url)
    }   
})
