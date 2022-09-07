import { Role } from 'src/constants/user-role.enum';
import { FeedPost } from 'src/feed/models/post.interface';

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  imagePath?: string;
  role?: Role;
  devRole?: string;
  posts?: FeedPost[];
}
