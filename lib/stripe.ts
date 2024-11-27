import Stripe from "stripe"

export const stripe = new Stripe(process.env.HME_LOG!, {
    apiVersion: "2024-09-30.acacia"
})