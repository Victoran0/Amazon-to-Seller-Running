

// function taht handles what would be done on the orders page
const orderListPageAction = () => {
    // getting all the elements we have to take actions on
    const table = document.querySelector('.table.card-table.tr-model-order-list')
    const tableBody = table.getElementsByTagName('tbody')[0]
    const allOrders = tableBody.getElementsByTagName('tr')

    const nextBtnEle = document.querySelector('.page-item.PagedList-skipToNext')
    const nextBtn = nextBtnEle.querySelector('.page-link')

    console.log('table:', table,'tableBody:', tableBody,'allOrders:', allOrders,'nextBtn:', nextBtn,'nextBtnEle:', nextBtnEle)


    for (let i = 0; i<allOrders.length; i++) {

        // checking if the order has the preconfirmed and does not have home icon
        if (!allOrders[i].contains(allOrders[i].querySelector('.fe.fe-home.text-primary-sr')) && allOrders[i].contains(allOrders[i].querySelector('.badge.badge-secondary.fs-p90'))) {
            console.log(allOrders[i])
            
            // opening each that match the criteria in a new window
            const orderPageLink = allOrders[i].getElementsByTagName('a')[0].href.split('orders/')[1]
            console.log('orderPageLink:', orderPageLink)
            window.open(`orders/${orderPageLink}`, `preconfirmedOrder${i}`, 'width = 400, height = 400')
        }
    }

    // opening the next page in a new tab
    if (nextBtn) {
        window.open(nextBtn.href)
    }
    
}

// initializing object to send to the storage
const orderDetails = {
    'orderId': {
        'isShipped': false,
        'orderNum': '',
        'carrier': '',
        'trackingId': '',
        'trackingURL': ''
    }
}

// chrome.storage.local.set({key: JSON.stringify(orderDetails)}).then(() => {
//     console.log(JSON.stringify(orderDetails))
// })

const fetchData = async () => {
    let obj = {}
    await chrome.storage.local.get(['key']).then((result) => {
        obj = JSON.parse(result.key)
    });
    return obj
}

// select section id OrderDetailOrderShipmentsModelUpdate_Status



const addShipmentFunc = (url, carr, ID) => {
    const select = document.getElementById('OrderDetailOrderShipmentsModelUpdate_Status')
    const trackingUrl = document.getElementById('OrderDetailOrderShipmentsModelUpdate_TrackingUrl')
    const carrier = document.getElementById('OrderDetailOrderShipmentsModelUpdate_ShippingCarrier')
    const trackingId = document.getElementById('OrderDetailOrderShipmentsModelUpdate_TrackingId')
    
    const orderForm = document.querySelector('[action="/orders/update-order-shipments"]')
    const submitBtn = orderForm.querySelector('.btn.btn-primary.tracksent')
    
    console.log('trackingUrl:', trackingUrl, 'carrier:', carrier, 'trackingId:', trackingId, 'orderForm:', orderForm, 'submitBtn:', submitBtn)
    
    
    select.value = 'Shipped'
    trackingUrl.value = url
    carrier.value = carr
    trackingId.value = ID

    submitBtn.click()
}


// function that handles what should be done on each order page
const orderPageAction = async () => {
        const orderData = await fetchData()
        // order-number of the page on seller running
        const orderNum = window.location.href.split('orders/')[1]

        // button to check if it has been previously updated
        const shipped = document.querySelector('.badge.badge-success.fs-p90')

        // the link that goes to the amazon track package button page
        const buyerOtd = document.querySelector('[data-original-title="View order on Amazon.com"]')
        const orderId = buyerOtd.textContent
        const amazonPageLink = buyerOtd.href

        const addShipment = document.querySelector('.btn-link.add-shipment-item.float-right')
        const trackingUrl = document.getElementById('OrderDetailOrderShipmentsModelUpdate_TrackingUrl')

        // check the carrier correct element
        const carrier = document.getElementById('OrderDetailOrderShipmentsModelUpdate_ShippingCarrier')
        const trackingId = document.getElementById('OrderDetailOrderShipmentsModelUpdate_TrackingId')


        console.log('orderNum:', orderNum, 'buyerOtd:', buyerOtd, 'orderId:', orderId, 'amazonPageLink:', amazonPageLink, 'addShipment:', addShipment, 'orderData:', orderData)

        if (!shipped) {

            if (orderData && orderData[orderId] && orderData[orderId]['isShipped']) {
                addShipment.click()
                setTimeout(() => addShipmentFunc(orderData[orderId]['trackingURL'], orderData[orderId]['carrier'], orderData[orderId]['trackingId']), 3000)
                
            } else {
                // we can wrap this in another function
                orderDetails[orderId] = {
                    'isShipped': false,
                    'orderNum': orderNum,
                    'carrier': '',
                    'trackingId': '',
                    'trackingURL': ''
                }
                chrome.storage.local.set({key: JSON.stringify(orderDetails)}).then(() => {
                    console.log(JSON.stringify(orderDetails))
                })
                
                window.open(amazonPageLink)
            }
        }
}
    
    // knowing what url we are using the message passing and striking the actions
    chrome.runtime.onMessage.addListener((obj, sender, request) => {
        if (obj.message === 'orders page') {
            orderListPageAction()
        }
    
        if (obj.message === 'order page') {
            orderPageAction()
        }
    })
                
                
                
//                 chrome.storage.local.set({'yes': JSON.stringify({sent: 'yes'})}).then(() => {
//                     console.log('sent to storage')
// })


// const fetchData = async () => {
//     let arr = {}
//     await chrome.storage.local.get(['key']).then((result) => {
//         arr = JSON.parse(result.key)
//     });
//     console.log(arr)
// }

// fetchData()
// setTimeout(() => fetchData(), 3000)



