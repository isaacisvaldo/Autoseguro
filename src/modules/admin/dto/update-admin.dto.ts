
  export class UpdateAdministratorDTO {
    id!:number
    name!: string;
    email!: string;
    password!: string;
    accessLevelId!: number;
    isActive!: boolean;
    phone!: string;
    nif!: string;
    avatarUrl?: string;
  }