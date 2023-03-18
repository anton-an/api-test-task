export type User = {
  id: number | string;
  name: string;
  email: string;
  access: boolean;
  lastName: string;
  birthDate: string;
};

export type NewUser = {
  name: string;
  email: string;
  access: boolean;
  lastName: string;
  birthDate: string;
};
