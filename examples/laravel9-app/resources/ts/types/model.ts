export type Post = {
    id: number;
    title: string;
    body: string;
    type: PostType;
    user_id: number;
    created_at?: string;
    updated_at?: string;
    author?: User;
};
export type User = {
    id: number;
    name: string;
    email: string;
    gender: GenderType;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    posts?: Post[];
};
export enum GenderType {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}
export enum PostType {
    Public = 10,
    Private = 20
}
