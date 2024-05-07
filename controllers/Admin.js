import argon2 from "argon2";
import Admin from "../models/AdminModel.js";

export const getMe = async (req, res) => {
    const admin = await Admin.findOne({
        where: {
            id: req.decoded.id,
        },
        attributes: ['name', 'email', 'role'] 
    });
    if (admin) {
        res.json(admin);
    } else {
        res.sendStatus(404);
    }
}

export const getAllAdmin = async (req, res) => {
    try {
        // Ambil semua data pengguna dari database
        const admin = await Admin.findAll({
            attributes: ['id', 'name', 'email', 'role'] 
        });
        // Kembalikan data pengguna sebagai respons
        res.json(admin);
    } catch (error) {
        console.error('Error getting all admins:', error);
        res.sendStatus(500); // Internal Server Error jika terjadi kesalahan
    }
};

export const addAdmin = async(req, res) => {
    const {name, email, role, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "password dan confirm password tidak cocok"});
    try {
        const existingAdmin = await Admin.findOne({
            where: {
                email: email,
            }
        });
        if (existingAdmin) return res.status(400).json({ msg: "Email sudah terdaftar." });
        const hashPassword = await argon2.hash(password);
        await Admin.create({
            name: name,
            email: email,
            role: role,
            password: hashPassword
        });
        res.json({msg: "Penambahan admin berhasil!"});
    } catch (error) {
        console.log(error);
    }
};

export const updateEmailAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const {email} = req.body;

        const adminToUpdate = await Admin.findOne({
            where: {
                id: id
            }
        });

        if (!adminToUpdate) {
            return res.status(404).json({ msg: 'Admin not found' });
        }
        
        await Admin.update({
            email: email
        },{
            where: {
                id: id
            }
        });
        res.json({ msg: 'Admin email updated successfully'});
    } catch (error) {
        console.log(error);
        console.error('Error updating Admin:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const updatePasswordAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, confPassword } = req.body;

        if(password !== confPassword) return res.status(400).json({msg: "password dan confirm password tidak cocok"});
        const hashPassword = await argon2.hash(password);

        const adminToUpdate = await Admin.findOne({
            where: {
                id: id
            }
        });

        if (!adminToUpdate) {
            return res.status(404).json({ msg: 'Admin not found' });
        }
        
        await Admin.update({
            password: hashPassword
        },{
            where: {
                id: id
            }
        });

        // Kembalikan respons sukses
        res.json({ msg: 'Admin password updated successfully'});
    } catch (error) {
        console.log(error);
        console.error('Error updating Admin:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const adminToDelete = await Admin.findOne({ id });

        if (!adminToDelete) {
            return res.status(404).json({ msg: 'Admin not found' });
        }

        await Admin.destroy({
            where: {
                id: id
            }
        });

        res.json({ msg: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};