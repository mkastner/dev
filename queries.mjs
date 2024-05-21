// queries.mjs

export const getUsers = "SELECT * FROM public.\"Users\"";
export const getUserByUuid = "SELECT * FROM public.\"Users\" WHERE uuid = $1";
export const checkEmailExists = "SELECT s FROM public.\"Users\" s WHERE s.email = $1";
export const createUsers = "INSERT INTO public.\"Users\" (firstname, lastname, email, age, uuid) VALUES ($1, $2, $3, $4, $5) RETURNING uuid";
