function normalizeUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo,  // sempre string
    photos: user.photos || [], // garantir array
    isPaid: user.isPaid,
    paidUntil: user.paidUntil,
    plan: user.plan,
    profile: user.profile,
    preference: user.preference,
    boosts: user.boosts,
    credits: user.credits,
    likesSent: user.likesSent,
    likesReceived: user.likesReceived,
    payments: user.payments,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}
module.exports = { normalizeUserPayload };