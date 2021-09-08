import adminRepository from './model/admin/admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


// operations deleteAll, deleteMany, addOne
const AdminOperations = {
    add: addAdmin,
    delete: deleteAdmins,
    reset: resetPassword,
}

export async function determineOperation(argv){
    const operation = argv.op;
    if(!operation){
        console.error("Error: Operation don't exist");
        process.exit(1);
    }
    if(!AdminOperations[operation]){
        console.error("Error: This Operation is not supported you can use one of the following opeartions add, delete and reset");
        process.exit(1);
    }
    
    await AdminOperations[operation](argv);
}

async function addAdmin(argv){
    const createAdminDto = constructCreateAdminDto(argv);
    const admin = await adminRepository.findAdmin(createAdminDto.email);    
    if(admin){
        console.error(`Error: The e-mail ${createAdminDto.email} already exist`);
        process.exit(1);
    }
    await adminRepository.createAdmin(createAdminDto);
    process.exit(0);
}

async function deleteAdmins(argv){
    const emails: string[] = argv.emails;
    if(emails.length === 0){
        console.error('Error: Enter at least one email');
        process.exit(1);
    }
    await adminRepository.deleteAdmins(emails);
    process.exit(0);
}

async function resetPassword(argv) {
    const resetPasswordDto = constructResetPasswordDto(argv);
    await adminRepository.resetPassword(resetPasswordDto);
    process.exit(0);
}

function constructResetPasswordDto(argv){
    const { email, password } = argv;    
    const resetPasswordDto = {} as ResetPasswordDto;
    if(email){
        validateEmail(email);
        resetPasswordDto.email = email;
    }else{
        console.error('Error: Enter a valid email');
        process.exit(1);
    }
    if(password.length){
        validatePassword(password);
        resetPasswordDto.password = password;
    }else{
        console.error('Error: Enter a valid password');
        process.exit(1);
    }
    return resetPasswordDto;
}

function constructCreateAdminDto(argv): CreateAdminDto{
    const createAdminDto = {} as CreateAdminDto
    const { email, password, username } = argv;
    if(email){
        validateEmail(email);
        createAdminDto.email = email;
    }else{
        console.error('Error: Enter a valid email');
        process.exit(1);
    }
    if(password.length > 0){
        validatePassword(password)
        createAdminDto.password = password;
    }else{
        console.error('Error: Enter a valid password');
        process.exit(1);
    }
    if(username.length > 0){
        createAdminDto.username = username;
    } else{
        console.error('Error: Enter a valid username');
        process.exit(1);
    }
    return createAdminDto;
}

function validateEmail(email: string){
    const emailregex = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
    if(!emailregex.test(email)){
        console.error('Error: Enter a valid email');
        process.exit(1);
    }
}

function validatePassword(password: string){
    const passwordRegex = new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);
    if(!(password.length > 8)){
        console.error('Error: Password should be at least 8 character long');
        process.exit(1);
    }
    if(!passwordRegex.test(password)) {
        console.error('Error: Password should contain at least one symbol and one capital letter');
        process.exit(1);
    }
}