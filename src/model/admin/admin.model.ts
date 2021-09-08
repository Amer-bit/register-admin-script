import { Admin } from './admin.schema';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import { ResetPasswordDto } from '../../dto/reset-password.dto';

class AdminRepository {
    constructor(
        private adminModel = Admin,
    ){}

    async findAdmin(email: string){
        const admin = await this.adminModel.findOne({email});
        return admin;
    }

    async createAdmin(createAdminDto: CreateAdminDto){
        const { email, username, password } = createAdminDto;
        const admin:any = new this.adminModel();
        const { hashedPassword } = await this.hashPassword(password);
        admin.email = email;
        admin.password = hashedPassword;
        admin.username = username;
        await this.saveModel(admin);
    }

    async deleteAdmins(emails: string[]){
        const failedDeletion = [];
        for(const email of emails){
            try {
                const deletedEmail = await this.adminModel.deleteOne({email});
                if(deletedEmail.deletedCount === 0) failedDeletion.push(email);
            } catch (error) {
                console.error(error);
            }
        }
        if(failedDeletion.length > 0) console.log({Failed_Deletion: failedDeletion});
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto){
        const { email, password } = resetPasswordDto;        
        const { hashedPassword } = await this.hashPassword(password);
        const admin: any = await this.findAdmin(email);
        if(!admin){
            console.error(`Error: Could not Find an admin with the ${email}`);
            process.exit()
        }
        admin.password = hashedPassword;
        await this.saveModel(admin);
    }

    private async saveModel(adminModel){
        try {
            await adminModel.save();
            console.log('User Has been saved');
        } catch (error) {
            console.error(error);
            throw new Error("not saved");
        }
    }

    private async hashPassword(passwordTobeHashed: string): Promise<{ hashedPassword: string }>{
        const salt = await bcrypt.genSalt() 
        const password = await bcrypt.hash(passwordTobeHashed, salt);
        return { hashedPassword: password };
    }
}

export default new AdminRepository();