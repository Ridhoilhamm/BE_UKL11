import Food from "../models/FoodModel.js";
import { fileURLToPath } from 'url';
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export const addFood = async (req, res) => {
//     try {
//         // Ambil data dari request body
//         const { name, spicy_level, price } = req.body;
//         const image = req.file ? req.file.filename : null;

//         // Validasi input
//         if (!name || !spicy_level || price === undefined || image === null) {
//             return res.status(400).json({ msg: 'All fields are required' });
//         }

//         // Memeriksa apakah menu sudah ada
//         const existingMenu = await Food.findOne({
//             where: {
//                 name: name
//             }
//         });

//         // Jika menu sudah ada, kembalikan pesan error
//         if (existingMenu) {
//             return res.status(400).json({ msg: 'Menu already exists' });
//         }

//         // Buat entri baru di tabel Food
//         const newFood = await Food.create({
//             name: name,
//             spicy_level: spicy_level,
//             price: price,
//             image: image
//         });

//         // Kembalikan respons sukses dengan entri makanan baru
//         res.status(201).json({
//             success: true,
//             data: newFood,
//             msg: 'Food has been created successfully'
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             msg: 'An error occurred while creating food',
//             error: error.message
//         });
//     }
// };

export const addFood = async (req, res) => {
    try {
        const {name, spicy_level, price} = req.body;
        const image = req.file.filename;
        const existingMenu = await Food.findOne({
            where: {
                name: name
            }
        });
        if (existingMenu) return res.status(400).json({ msg: "Menu sudah ada" });   
        if (!req.file) {
            return res.status(400).json({ msg: 'Image is required' });
        }
        const newFood = await Food.create({
            name: name,
            spicy_level: spicy_level,
            price: price,
            image: image
        });
        res.json({
            status: true,
            data: newFood,
            msg: "Food has created"
        })
    } catch (error) {
       console.log(error);
    }
};

export const getAllFood = async (req, res) => {
    try {
        const findFood = await Food.findAll({
            attributes: ['id', 'name', 'spicy_level', 'price', 'image']
        });
        res.json({
            data: findFood
        });
    } catch (error) {
        console.log(error);
    }
};

export const findFood = async (req, res) => {
    try {
        let keyword = req.params.key
        let food = await Food.findAll({
        where: {
            [Op.or]: [
                {name: { [Op.substring]: keyword }}
            ]
        }
        });

        if (food.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'Menu tidak ditemukan'
            });
        }   
       
        res.json({
            success: true,
            data: food,
            msg: "All Food has been loaded"
        })       
    } catch (error) {
        res.status(501).json(error)
        console.log(error);
    }
}

export const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, spicy_level, price } = req.body;

        if (!name || !spicy_level || price === undefined) {
            return res.status(400).json({ msg: 'fields name, spicy_level, and price are required' });
        }

        // Temukan makanan berdasarkan ID
        const foodToUpdate = await Food.findOne({ where: { id } });
        if (!foodToUpdate) {
            return res.status(404).json({ msg: 'Food not found' });
        }

        // Periksa apakah ada gambar baru yang diunggah
        if (req.file && req.file.filename) {
            const oldImagePath = path.join(__dirname, '../image', foodToUpdate.image);

            // Hapus gambar lama jika ada
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Perbarui gambar dengan gambar baru
            foodToUpdate.image = req.file.filename;
        }

        // Perbarui data makanan
        foodToUpdate.name = name;
        foodToUpdate.spicy_level = spicy_level;
        foodToUpdate.price = price;

        // Simpan perubahan
        await foodToUpdate.save();

        // Kirim respons berhasil
        res.json({
            status: true,
            data: foodToUpdate,
            msg: 'Food has been updated successfully'
        });
    } catch (error) {
        console.error('Error updating food:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const foodToDelete = await Food.findOne({where: {id: id}});
        const oldImage = foodToDelete.image;
        const pathImage = path.join(__dirname, '../image', oldImage)

        if (fs.existsSync(pathImage)) {
            fs.unlink(pathImage, error => console.log(error))
        }

        Food.destroy({
            where: {id: id}
        });

        res.json({
            success: true,
            data: foodToDelete,
            msg: "data deleted"
        })
    } catch (error) {
        console.error('Error deleting food:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}