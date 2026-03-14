const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  img: { type: String },
  description: { type: String, require: true },
  rating: { type: Number, default: 0 },
  stock: { type: Number, require: true },
  nbr_commande: { type: Number, default: 0 },
  
  
  category: {
    type: String,
    enum: [
      "AMD Radeon RX 7000 Series",
      "AMD Radeon RX 6000 Series",
      "NVIDIA RTX 40 Series",
      "NVIDIA RTX 30 Series",
      "Intel Arc Series",
      "Cartes Graphiques",
      "Processeurs",
      "Cartes Mères",
      "RAM",
      "Stockage SSD/HDD",
      "Alimentations",
      "Boîtiers",
      "Refroidissement",
      "Périphériques"
    ],
    default: "Cartes Graphiques"
  }
}, { timestamps: true });

const product = mongoose.model('product', productSchema);
module.exports = product;