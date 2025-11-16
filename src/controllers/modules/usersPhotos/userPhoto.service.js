const repository = require("./userPhoto.repository");
const path = require("path");

const PUBLIC_BASE = "/uploads/photos";

const toPublicPath = (file) =>
  file ? `${PUBLIC_BASE}/${file.filename}` : null;

module.exports = {
  async list(userId) {
    return repository.list(userId);
  },

  async create(userId, file) {
    if (!file) throw new Error("photo é obrigatória");

    const last = await repository.getLastPosition(userId);
    const nextPos = (last?.position || 0) + 1;

    const url = toPublicPath(file);

    return repository.create(userId, url, nextPos);
  },

  async createMany(userId, files) {
    if (!files || files.length === 0) {
      throw new Error("Nenhuma foto enviada");
    }

    const last = await repository.getLastPosition(userId);
    let nextPos = (last?.position || 0) + 1;

    const created = [];

    for (const file of files) {
      const url = toPublicPath(file);
      const photo = await repository.create(userId, url, nextPos);
      created.push(photo);
      nextPos++;
    }

    return {
      uploaded: created.length,
      photos: created
    };
  },

  async updateByPosition(userId, position, file) {
    if (!file) throw new Error("photo é obrigatória");

    const url = toPublicPath(file);
    position = Number(position);

    if (position < 1 || position > 8)
      throw new Error("position deve ser entre 1 e 8");

    const existing = await repository.findByPosition(userId, position);

    if (existing) {
      return repository.updateUrl(existing.id, url);
    }

    return repository.create(userId, url, position);
  },

  async bulkUpdate(userId, data, files) {
  // data = array com a ordem final
  // files = uploads novos

  // 1) Fotos antigas do usuário
  const existing = await repository.list(userId);

  // Mapa: tempKey -> file enviado
  const fileMap = {};
  for (const file of files) {
    fileMap[file.originalname] = file; 
  }

  const finalPhotos = [];
  const toDelete = [];

  // 2) Processar array final
  for (const item of data) {
    if (item.id) {
      // Foto existente → atualizar posição
      const oldPhoto = existing.find(p => p.id === item.id);

      if (!oldPhoto) {
        throw new Error(`Foto id ${item.id} não existe`);
      }

      finalPhotos.push({
        ...oldPhoto,
        position: Number(item.position)
      });

    } else if (item.tempKey) {
      // Foto nova → criar
      const file = fileMap[item.tempKey];
      if (!file) throw new Error(`Arquivo '${item.tempKey}' não enviado`);

      const url = toPublicPath(file);

      finalPhotos.push({
        id: null,
        url,
        position: Number(item.position)
      });
    }
  }

  // 3) Fotos para deletar
  for (const old of existing) {
    if (!finalPhotos.find(p => p.id === old.id)) {
      toDelete.push(old.id);
    }
  }

  // 4) Persistir
  // delete removidas
  for (const id of toDelete) {
    await repository.remove(id);
  }

  // update / create final
  const saved = [];

  for (const p of finalPhotos) {
    if (p.id) {
      // atualizar
      const updated = await repository.updatePositionAndUrl(p.id, p.url || null, p.position);
      saved.push(updated);
    } else {
      // criar nova
      const created = await repository.create(userId, p.url, p.position);
      saved.push(created);
    }
  }

  // 5) ordenar retorno
  saved.sort((a, b) => a.position - b.position);

  return {
    updated: saved.length,
    deleted: toDelete.length,
    photos: saved
  };
},

  async remove(photoId) {
    return repository.remove(photoId);
  }
};
