// src/controllers/modules/adminUsers/adminUser.repository.js
const { prisma } = require("../../../dataBase/prisma");

module.exports = {

  // ============================================
  // 🔥 LIST PAGINADA — FULL COMPLETO (PESADÃO)
  // ============================================
  async list(page, limit) {
    const [items, total] = await Promise.all([

      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },

        include: {
          // PLANO
          plan: true,

          // PERFIS -> COMPLETO
          profileBasic: true,
          profileLocation: true,
          profileLifestyle: true,
          profileWork: true,
          profileRelation: true,
          profileInterests: true,
          profileExtra: true,

          // PREFERÊNCIAS
          preference: true,

          // FOTOS
          photos: true,

          // PAGAMENTOS + PRODUTOS
          payments: {
            include: {
              product: true,
            },
          },

          // BOOST CREDITS + ATIVAÇÕES
          credits: {
            include: {
              product: true,
              activations: true,
            },
          },

          // BOOSTS
          boosts: {
            include: {
              credit: true,
            },
          },

          // LIKES ENVIADOS
          likesSent: {
            include: {
              liked: true,
            },
          },

          // LIKES RECEBIDOS
          likesReceived: {
            include: {
              liker: true,
            },
          },
        },
      }),

      prisma.user.count(),
    ]);

    return {
      items,
      pagination: { page, limit, total },
    };
  },

  // ============================================
  // 🔥 GETONE COMPLETO (SEM ALTERAÇÃO)
  // ============================================
  async getOne(id) {
    return prisma.user.findUnique({
      where: { id },

      include: {
        plan: true,

        profileBasic: true,
        profileLocation: true,
        profileLifestyle: true,
        profileWork: true,
        profileRelation: true,
        profileInterests: true,
        profileExtra: true,

        preference: true,
        photos: true,

        payments: {
          include: { product: true },
        },

        credits: {
          include: { product: true, activations: true },
        },

        boosts: {
          include: { credit: true },
        },

        likesSent: {
          include: { liked: true },
        },

        likesReceived: {
          include: { liker: true },
        },
      },
    });
  },

  // ============================================
  // 🔥 UPDATE TOTAL (FULL) — já pronto no seu código
  // ============================================
  async update(id, data) {
    return prisma.$transaction(async (tx) => {
      const {
        user,
        profileBasic,
        profileLocation,
        profileLifestyle,
        profileWork,
        profileRelation,
        profileInterests,
        profileExtra,
        preference,
        photos,
        payments,
        credits,
        boosts,
        likesSent,
        likesReceived,
      } = data;

      // -------- UPDATE TABELA USER --------
      if (user) {
        await tx.user.update({
          where: { id },
          data: user,
        });
      }

      // -------- UPDATE PERFIS 1–1 --------
      if (profileBasic) {
        await tx.userProfileBasic.upsert({
          where: { userId: id },
          create: { userId: id, ...profileBasic },
          update: profileBasic,
        });
      }

      if (profileLocation) {
        await tx.userProfileLocation.upsert({
          where: { userId: id },
          create: { userId: id, ...profileLocation },
          update: profileLocation,
        });
      }

      if (profileLifestyle) {
        await tx.userProfileLifestyle.upsert({
          where: { userId: id },
          create: { userId: id, ...profileLifestyle },
          update: profileLifestyle,
        });
      }

      if (profileWork) {
        await tx.userProfileWorkEducation.upsert({
          where: { userId: id },
          create: { userId: id, ...profileWork },
          update: profileWork,
        });
      }

      if (profileRelation) {
        await tx.userProfileRelationInfo.upsert({
          where: { userId: id },
          create: { userId: id, ...profileRelation },
          update: profileRelation,
        });
      }

      if (profileInterests) {
        await tx.userProfileInterests.upsert({
          where: { userId: id },
          create: { userId: id, ...profileInterests },
          update: profileInterests,
        });
      }

      if (profileExtra) {
        await tx.userProfileExtra.upsert({
          where: { userId: id },
          create: { userId: id, ...profileExtra },
          update: profileExtra,
        });
      }

      if (preference) {
        await tx.userPreference.upsert({
          where: { userId: id },
          create: { userId: id, ...preference },
          update: preference,
        });
      }

      // -------- FOTOS (REPLACE TOTAL) --------
      if (Array.isArray(photos)) {
        await tx.userPhoto.deleteMany({ where: { userId: id } });

        if (photos.length) {
          await tx.userPhoto.createMany({
            data: photos.map((p, index) => ({
              id: p.id ?? undefined,
              userId: id,
              url: p.url,
              position: p.position ?? index,
            })),
          });
        }
      }

      // -------- PAYMENTS --------
      if (Array.isArray(payments)) {
        await tx.payment.deleteMany({ where: { userId: id } });

        if (payments.length) {
          await tx.payment.createMany({
            data: payments.map((p) => ({
              id: p.id ?? undefined,
              userId: id,
              amount: p.amount,
              currency: p.currency ?? "USD",
              status: p.status,
              referenceId: p.referenceId ?? null,
              createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
              paidAt: p.paidAt ? new Date(p.paidAt) : null,
              expiresAt: p.expiresAt ? new Date(p.expiresAt) : null,
              plan: p.plan ?? null,
              productId: p.productId ?? null,
            })),
          });
        }
      }

      // -------- CRÉDITOS E BOOSTS --------
      if (Array.isArray(credits) || Array.isArray(boosts)) {
        await tx.boostActivation.deleteMany({ where: { userId: id } });
        await tx.boostCredit.deleteMany({ where: { userId: id } });

        if (Array.isArray(credits) && credits.length) {
          await tx.boostCredit.createMany({
            data: credits.map((c) => ({
              id: c.id ?? undefined,
              userId: id,
              productId: c.productId ?? null,
              type: c.type,
              credits: c.credits,
              used: c.used ?? 0,
              expiresAt: c.expiresAt ? new Date(c.expiresAt) : null,
            })),
          });
        }

        if (Array.isArray(boosts) && boosts.length) {
          await tx.boostActivation.createMany({
            data: boosts.map((b) => ({
              id: b.id ?? undefined,
              userId: id,
              type: b.type,
              status: b.status,
              startsAt: new Date(b.startsAt),
              endsAt: new Date(b.endsAt),
              creditId: b.creditId ?? null,
            })),
          });
        }
      }

      // -------- LIKES --------
      if (Array.isArray(likesSent) || Array.isArray(likesReceived)) {
        await tx.like.deleteMany({
          where: {
            OR: [{ likerId: id }, { likedId: id }],
          },
        });

        const allLikes = [];

        if (Array.isArray(likesSent)) {
          allLikes.push(
            ...likesSent.map((l) => ({
              id: l.id ?? undefined,
              likerId: l.likerId,
              likedId: l.likedId,
              createdAt: l.createdAt ? new Date(l.createdAt) : undefined,
            }))
          );
        }

        if (Array.isArray(likesReceived)) {
          allLikes.push(
            ...likesReceived.map((l) => ({
              id: l.id ?? undefined,
              likerId: l.likerId,
              likedId: l.likedId,
              createdAt: l.createdAt ? new Date(l.createdAt) : undefined,
            }))
          );
        }

        if (allLikes.length) {
          await tx.like.createMany({ data: allLikes });
        }
      }

      // -------- RETORNAR TUDO ATUALIZADO --------
      return tx.user.findUnique({
        where: { id },
        include: {
          plan: true,
          profileBasic: true,
          profileLocation: true,
          profileLifestyle: true,
          profileWork: true,
          profileRelation: true,
          profileInterests: true,
          profileExtra: true,
          preference: true,
          photos: true,
          payments: { include: { product: true } },
          credits: { include: { product: true, activations: true } },
          boosts: { include: { credit: true } },
          likesSent: { include: { liked: true } },
          likesReceived: { include: { liker: true } },
        },
      });
    });
  },

  async remove(id) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
