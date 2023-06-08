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
        if (!allOrders[i].contains(allOrders[i].querySelector('.fe.fe-home.text-primary-sr')) && allOrders[i].contains(allOrders[i].querySelector('.avatar-group.d-none.d-sm-flex'))) {
            setTimeout(() => {
                window.open(allOrders[i].getElementsByTagName('a')[0].href)
            }, 1000 * i)
        }
    }
    
    if (nextBtn !== undefined) {
        setTimeout(() => window.open(nextBtn.href), (1 + allOrders.length) * 1000)
    }
    setTimeout(() => window.close(), (1.3 + allOrders.length) * 1000)
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

const setOrderData = (orderData, orderId, orderNum, amazonPageLink, bool) => {
    orderData[orderId] = {
        'isShipped': bool,
        'isDelivered': false,
        'orderNum': orderNum,
        'carrier': '',
        'trackingId': '',
        'trackingURL': ''
    }

    chrome.storage.local.set({key: JSON.stringify(orderData)})
    window.open(amazonPageLink)
    window.close()
}

const setDelivered = () => {
    const orderForm = document.getElementById('UpdateOrderContents')
    const submitBtn = orderForm.getElementsByTagName('button')[0]
    const select = document.getElementById('OrderDetailOrderContentsModelUpdate_OrderStatus')

    select.value = 'Delivered'
    submitBtn.click()
}

const orderPageAction = async () => {
        const orderData = await fetchData()

        const orderNum = window.location.href.split('orders/')[1]
        const shipped = document.querySelector('.badge.badge-success.fs-p90')
        const delivered = document.querySelector('.badge.badge-primary.fs-p90')
        const buyerOtd = document.querySelector('[data-original-title="View order on Amazon.com"]')

        const orderId = buyerOtd.textContent
        const amazonPageLink = buyerOtd.href

        const addShipment = document.querySelector('.btn-link.add-shipment-item.float-right')

        const edit = document.querySelector('.btn-link.edit-order-item')

        if (!shipped && !delivered) {
            if (Object.keys(orderData) !== 0 ) {
                if (orderData[orderId] && orderData[orderId]['isShipped']) {
                    addShipment.click()

                    setTimeout(() => addShipmentFunc(orderData[orderId]['trackingURL'], orderData[orderId]['carrier'], orderData[orderId]['trackingId']), 4000)
                    
                } else {
                    setOrderData(orderData, orderId, orderNum, amazonPageLink, false)
                }
            } else {
                setOrderData(orderDetails, orderId, orderNum, amazonPageLink, false)
            }
        }

        if (shipped && !delivered) {
            if (Object.keys(orderData) !== 0) {
                if (orderData[orderId]) {
                    if (orderData[orderId]['isDelivered']) {
                        edit.click()
                        setTimeout(() => setDelivered(), 4000)
                    }
                } else {
                    setOrderData(orderData, orderId, orderNum, amazonPageLink, true)
                }
            } else {
                setOrderData(orderDetails, orderId, orderNum, amazonPageLink, true)
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
