const orderDetails = {}

const orderListPageAction = () => {
    const table = document.querySelector('.table.card-table.tr-model-order-list')
    const tableBody = table.getElementsByTagName('tbody')[0]
    const allOrders = tableBody.getElementsByTagName('tr')

    const nextBtnEle = document.querySelector('.page-item.PagedList-skipToNext')
    let nextBtn;
    if (nextBtnEle) {
        nextBtn = nextBtnEle.querySelector('.page-link')
    }

    for (let i = 0; i<allOrders.length; i++) {
        if (!allOrders[i].contains(allOrders[i].querySelector('.fe.fe-home.text-primary-sr'))) {
            const orderPageId = allOrders[i].getElementsByTagName('a')[0].href.split('orders/')[1]
            window.open(`orders/${orderPageId}`)
        }
    }

    if (nextBtn !== undefined) {
        window.open(nextBtn.href)
    }
    window.close()
}


const fetchData = async () => {
    let obj = {}
    await chrome.storage.local.get(['key']).then((result) => {
        if (result.key) {
            obj = JSON.parse(result.key)
        }
    });
    return obj
}

const addShipmentFunc = (url, carr, ID) => {
    const select = document.getElementById('OrderDetailOrderShipmentsModelUpdate_Status')
    const trackingUrl = document.getElementById('OrderDetailOrderShipmentsModelUpdate_TrackingUrl')
    const carrier = document.getElementById('OrderDetailOrderShipmentsModelUpdate_ShippingCarrier')
    const trackingId = document.getElementById('OrderDetailOrderShipmentsModelUpdate_TrackingId')
    const orderForm = document.querySelector('[action="/orders/update-order-shipments"]')
    const submitBtn = orderForm.querySelector('.btn.btn-primary.tracksent')

    select.value = 'Shipped'
    trackingUrl.value = url
    carrier.value = carr
    trackingId.value = ID
    submitBtn.click()
}

const setOrderData = (orderData, orderId, orderNum, amazonPageLink) => {
    orderData[orderId] = {
        'isShipped': false,
        'orderNum': orderNum,
        'carrier': '',
        'trackingId': '',
        'trackingURL': ''
    }

    chrome.storage.local.set({key: JSON.stringify(orderData)})
    window.open(amazonPageLink)
    window.close()
}

const orderPageAction = async () => {
        const orderData = await fetchData()

        const orderNum = window.location.href.split('orders/')[1]
        const shipped = document.querySelector('.badge.badge-success.fs-p90')
        const buyerOtd = document.querySelector('[data-original-title="View order on Amazon.com"]')

        const orderId = buyerOtd.textContent
        const amazonPageLink = buyerOtd.href

        const addShipment = document.querySelector('.btn-link.add-shipment-item.float-right')

        if (!shipped) {
            if (Object.keys(orderData) !== 0 ) {
                if (orderData[orderId] && orderData[orderId]['isShipped']) {
                    addShipment.click()

                    setTimeout(() => addShipmentFunc(orderData[orderId]['trackingURL'], orderData[orderId]['carrier'], orderData[orderId]['trackingId']), 4000)
                    
                } else {
                    setOrderData(orderData, orderId, orderNum, amazonPageLink)
                }
            } else {
                setOrderData(orderDetails, orderId, orderNum, amazonPageLink)
            }
        }
}

    
chrome.runtime.onMessage.addListener((obj, sender, request) => {
    if (obj.message === 'orders page') {
        orderListPageAction()
    }

    if (obj.message === 'order page') {
        orderPageAction()
    }

    if (obj.message === 'next page') {
        orderListPageAction()
    }
})


