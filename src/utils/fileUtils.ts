import fs from 'fs';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  hairLossStage: string;
  beforeImage: string;
  afterImage: string;
  comments: string;
  password: string;
  registerCode: string;
}

type Data = {
  patients: Patient[];
};

export const readData = (): Data => {
  const filePath = 'src/data.json';
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as Data;
  } catch (error) {
    console.error(`Error reading data from file: ${error}`);
    return { patients: [] };
  }
};

export const writeData = (data: Data): void => {
  const filePath = 'src/data.json';
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};