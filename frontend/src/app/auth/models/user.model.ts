import { Post } from 'src/app/home/models/Post';
import { Role } from 'src/constants/user.roles';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  imagePath?: string;
  posts?: Post[];
}
