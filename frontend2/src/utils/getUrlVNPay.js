import moment from "moment"
import QueryString from "qs"
import CryptoJS from "crypto-js"

const VNP_TMN_Code = "H41YA7F5"
const VNP_Hashsecret = "GQM7XF3K89CE3OPFYJV10BND0721448N"
const VNP_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"

export const randomNumber = () => {
  const min = 100000
  const max = 999999
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomNumber
}

const sortObject = (obj) => {
  let sorted = {}
  let str = []
  let key
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+")
  }
  return sorted
}

const handleCreatePaymentVNPay = (orderInfo, amount, returnUrl) => {
  let vnp_Params
  vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP_TMN_Code,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: randomNumber(),
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: +amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: "1.1.1.1",
    vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
  }
  vnp_Params = sortObject(vnp_Params)
  let signData = QueryString.stringify(vnp_Params, { encode: false })
  let hmac = CryptoJS.HmacSHA512(signData, VNP_Hashsecret)
  let signed = CryptoJS.enc.Hex.stringify(hmac)
  vnp_Params['vnp_SecureHash'] = signed
  const vnpURL = `${VNP_Url}?${QueryString.stringify(vnp_Params, { encode: false })}`
  window.location.href = vnpURL
}

export default handleCreatePaymentVNPay
