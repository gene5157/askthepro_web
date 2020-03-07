import { User } from 'user';

export class Question {
    id: Number;
    title: string; 
    date_post: Date; 
    user_id: string;
    summary: string;
    description: string; 
    category: string;
    categories_id: string;
    isAnswered: boolean;
    answer:Answer[];


}

export class Answer {
    id: Number;
    title: string; 
    date_post: Date; 
    userId: Number;
    questionId: Number;
    user:[User];
    description: string; 
    isBestAnswer: boolean;
    
}

export class Categories {
    id: Number;
    name: string;
    desc: string;
    
}
export class Tag {
    id: Number;
    name: string;
    desc: string;
    
}