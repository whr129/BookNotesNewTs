import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import "reflect-metadata";
import { DataSource, SelectQueryBuilder } from "typeorm"
import { User } from "./Entities/user";
import { Jwt, JwtPayload, sign, verify } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { randomInt, randomUUID } from "crypto";
import moment from 'moment';
import { SnowflakeId } from "@akashrajpurohit/snowflake-id";
import { match } from "assert";
import cookieParser from 'cookie-parser';
import { UserProfile } from "./types/User";
import { SignIn } from "./Entities/signIn";
import { signIn } from "./types/SignIn";
import { Schedule } from "./Entities/schedule";
import { schedule } from "./types/Schedule";
import { Book } from "./Entities/book";
import { Query } from "typeorm/driver/Query";
import { book } from "./types/Book";
import { BookNotes } from "./Entities/bookNotes";
import { bookNotes } from "./types/BookNotes";
import { BookQuote } from "./Entities/bookQuote";
import { bookQuote } from "./types/BookQuote";

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [User, SignIn, Schedule, Book,BookNotes,BookQuote],
    synchronize: true,
    logging: false,
});
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error));


const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("后来我总算学会了如何去爱");
});

//SNOWFLAKE SETTING
const snowflake = SnowflakeId({
  workerId: 1,
  epoch: 1721230962736,
});

//USER RELATED

//TOKEN TO USERID
const getUserId = (token: string | undefined | null) => {
  console.log(token);
  if(token) {
    try {
      const decodedToken : JwtPayload | string = verify(token, "jwtsecretplschange");
      if( typeof(decodedToken) === 'object') {
        return decodedToken.id;
      }
      return false;
    } catch(error) {
      console.log(error);
    }
  }
  return false;
}

//USER REGISTER
app.post("/register", async (req: Request, res: Response) => {
    //get Register Data
    const { userName, email, phoneNumber, password, checkPassword } = req.body;
    //print log
    console.log(userName, email, phoneNumber, password, checkPassword);
    //process data
    const currentDate: string = moment().format("YYYY-MM-DD HH:mm:ss");
    const hashedPassword: string = await bcrypt.hash(password, 8);
    const userId: string = snowflake.generate();
    //create model
    const newUser = new User();
    newUser.user_id = Number(userId);
    newUser.user_name = userName;
    newUser.create_time = currentDate;
    newUser.delete_time = null;
    newUser.is_delete = 0;
    newUser.email = email;
    newUser.phone_number = phoneNumber;
    newUser.password = hashedPassword;
    //save
    try {
      await AppDataSource.manager.save(newUser);
      console.log("User has been saved. User id is", newUser.user_id);
    } catch(error) {
      console.log(error);
      res.json({code: 500, data: "Register Error!", message: `${error}`})
    }
    res.json({code: 200, data: "Register Success!", message: ""});
});

//USER LOGIN
app.post("/login", async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  const firstUser: User | null = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.user_name = :userName", { userName: userName })
    .getOne();
  if(!firstUser) {
    return res.json({code: 400, data: '', message: "User Does Not Exist!"});
  }
  //compare passowrd
  bcrypt.compare(password, firstUser.password).then((match) => {
    if(!match) {
      res.json({code: 500, data: '', message: "Password is Wrong"});
    } else {
      //create tokens
      const accessToken = sign(
        {userName: firstUser.user_name, id: firstUser.user_id},
         "jwtsecretplschange",
         {expiresIn : 60 * 60 * 24 },
      );
      console.log(accessToken);
      res.json({code: 200, data: {"accessToken": accessToken, "expireTime": 1 }, message: ''});
    }
  })
})

app.post("/getUserInfo", async (req: Request, res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //get user profile
  const firstUser: User | null = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.user_id = :userId", { userId: Number(userId) })
    .andWhere("user.is_delete = 0")
    .getOne();
  if(!firstUser) {
    return res.json({code: 400, data: '', message: "User Does Not Exist!"});
  }
  const profile: UserProfile = {
    userName: firstUser.user_name,
    email: firstUser.email,
    phoneNumber: firstUser.phone_number,
  }
  res.json({code: 200, data: profile, message: ''});
})

//SIGN IN

//SIGN IN FOR TODAY
app.post("/signIn", async (req: Request, res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //save sign in data
  console.log(typeof(userId));
  const newSignIn = new SignIn();
  const id: string = snowflake.generate();
  newSignIn.id = Number(id);
  newSignIn.user_id = Number(userId);
  const currentDate: string = moment().format("YYYY-MM-DD");
  newSignIn.sign_in_date = currentDate;
  try {
    await AppDataSource.manager.save(newSignIn);
    console.log("Sign in has been saved. Sign In tiem is", newSignIn.sign_in_date);
  } catch(error) {
    console.log(error);
    res.json({code: 500, data: "Sign in Error!", message: `${error}`})
  }
  res.json({code: 200, data: "Sign Success!", message: ""});
})

//GET SIGN IN DATA
app.post("/getSignIn", async (req: Request, res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //GET DATA
  const { monthSelected } = req.body;
  const getSignList: Array<SignIn> | null = await AppDataSource
  .getRepository(SignIn)
  .createQueryBuilder("signIn")
  .where("signIn.user_id = :userId", { userId: Number(userId) })
  .andWhere("signIn.sign_in_date LIKE :month", {month: `${monthSelected}%`})
  .getMany();
  const signInInfo: Array<string> | null = getSignList?.map((item: SignIn, index: number) => {
    return  item.sign_in_date;
  })
  res.json({code: 200, messsage: '', data: signInInfo ? signInInfo : []});
})

//TO DO LIST

//ADD ITEM TO TO DO LIST
app.post("/addNewToDo", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //add new to do list item
  const {title, dueDate, content} = req.body;
  const newSchedule = new Schedule();
  const id: string = snowflake.generate();
  const currentDate: string = moment().format("YYYY-MM-DD HH:mm:ss");
  newSchedule.id = Number(id);
  newSchedule.user_id = Number(userId);
  newSchedule.title = title;
  newSchedule.due_date = dueDate;
  newSchedule.content = content;
  newSchedule.is_finished = 0;
  newSchedule.create_date = currentDate;
  try {
    await AppDataSource.manager.save(newSchedule);
    console.log("New to do Item has been saved. Add time is", newSchedule.create_date);
  } catch(error) {
    console.log(error);
    res.json({code: 500, data: "Add Error!", message: `${error}`})
  }
  res.json({code: 200, data: "Add Success", message: ''});
})

//Get To Do List
app.post("/getToDoList", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //get data
  const getToDoList: Array<Schedule> | null = await AppDataSource
  .getRepository(Schedule)
  .createQueryBuilder("Schedule")
  .where("Schedule.user_id = :userId", { userId: Number(userId) })
  .andWhere("Schedule.is_finished = 0")
  .orderBy("Schedule.due_date", "ASC")
  .getMany();
  const toDoData: Array<schedule> = getToDoList.map((item: Schedule, index: number) => {
    return {
      id: item.id,
      isFinished: item.is_finished,
      title: item.title,
      content: item.content,
      dueDate: item.due_date,
      overDue: new Date() > new Date(item.due_date),
    }
  })
  res.json({code: 200, messsage: '', data: toDoData});
})

//UPDATE FINISH
app.post("/finishToDo",  async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //update to do item
  const { id } = req.body;
  try {
    await AppDataSource
    .createQueryBuilder()
    .update(Schedule)
    .set({is_finished: 1, finish_time: moment().format('YYYY-MM-DD hh:mm:ss')})
    .where("id = :id", {id: Number(id)})
    .execute()
  } catch(error) {
    console.log(error);
    res.json({code: 500, data:'', message: 'Update Error'});
  }
  res.json({code: 200, data:'Finish Success', message: ''});
})

//UPDATE TO DO ITEM
app.post("/updateToDoItem", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //update to do item
  const { id, title, content, dueDate } = req.body;
  try {
    await AppDataSource
    .createQueryBuilder()
    .update(Schedule)
    .set({title: title, content: content, due_date: dueDate})
    .where("id = :id", {id: Number(id)})
    .execute()
  } catch(error) {
    console.log(error);
    res.json({code: 500, data:'', message: 'Update Error'});
  }
  res.json({code: 200, data:'Update Success', message: ''});
})

//BOOK

//ADD NEW BOOK
app.post("/addNewBook", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //add new data to database
  const { bookName, picUrl, author } = req.body;
  const id: string = snowflake.generate();
  const createTime: string = moment().format("YYYY-MM-DD HH:mm:ss");
  const newBook = new Book();
  newBook.id = Number(id);
  newBook.user_id = Number(userId);
  newBook.book_name = bookName;
  newBook.create_time = createTime;
  newBook.status = 0;
  newBook.pic_url = picUrl;
  newBook.author = author;
  newBook.is_delete = 0;
})

//GET BOOK DATA
app.post("/queryBookData", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //get book data
  const { author, bookName, status, pageNum, pageSize } = req.body;
  try {
    const query: SelectQueryBuilder<Book> = AppDataSource
    .getRepository(Book)
    .createQueryBuilder("Book");
    query.where("Book.user_id = :userId", { userId: Number(userId) })
      .andWhere("Book.status = :status", { status: Number(status)})
      .andWhere("Book.is_delete = 0")
      .orderBy("Book.create_time", "DESC");
    if(author && author !== '') {
      query.andWhere("Book.author LIKE :author", {author: `%${author}%`});
    }
    if(bookName && bookName !== '') {
      query.andWhere("Book.book_name LIKE :bookName", {bookName: `%${bookName}%`});
    }
    const total: number = await query.getCount();
    if(pageNum === 1) {
      query.take(pageSize);
    } else {
      query.skip((pageNum - 1) * pageSize)
        .take(pageSize);
    }
    
    const getBookList: Array<Book> | null = await query.getMany();
    const bookData: Array<book> = getBookList.map((item: Book, index: number) => {
      return {
        id: item.id,
        updateTime: item.update_time,
        createTime: item.create_time,
        beginTime: item.begin_time,
        endTime: item.end_time,
        status: item.status,
        author: item.author,
        page: item.page,
        readPage: item.read_page,
        bookName: item.book_name,
        isDelete: item.is_delete,
        deleteTime: item.delete_time,
        picUrl: item.pic_url,
        rate: item.rate,
      }
    })
      res.json({code: 200, data: {total: total, bookList: bookData}, message: ''});
  } catch(error) {
    console.log(error);
    res.json({code: 500, data: '', message: error});
  }
})

//DELETE BOOK
//TO DO 删除关联表
app.post("/deleteBook",  async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //Delete book
  const { id } = req.body;
  const currentTime: string = moment().format("YYYY-MM-DD hh:mm:ss");
  try {
    //Delete book
    await AppDataSource
    .createQueryBuilder()
    .update(Book)
    .set({is_delete: 1, delete_time: currentTime})
    .where("id = :id", {id: Number(id)})
    .execute()
    console.log(id, userId);
    //Delete book quote
    await AppDataSource
    .createQueryBuilder()
    .update(BookNotes)
    .set({is_delete: 1, delete_time: currentTime})
    .where("book_id = :id", {id: Number(id)})
    .andWhere("user_id = :userId", {userId: Number(userId)})
    .execute();
    //Delete book Notes
    await AppDataSource
    .createQueryBuilder()
    .update(BookQuote)
    .set({is_delete: 1, delete_time: currentTime})
    .where("book_id = :id", {id: Number(id)})
    .andWhere("user_id = :userId", {userId: Number(userId)})
    .execute();
  } catch(error) {
    console.log(error);
    res.json({code: 500, data:'', message: 'Delete Error'});
    return ;
  }
  res.json({code: 200, data:'Delete Success', message: ''});
})

//UPDATE STATUS / TIME FOR BOOK
app.post("/updateBook",  async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //update book
  const { id, status, page, readPage, rate } = req.body;
  const currentTime: string = moment().format("YYYY-MM-DD hh:mm:ss");
  try {
    await AppDataSource
    .createQueryBuilder()
    .update(Book)
    .set({...(status && {status: status}), 
        ...(page && { page : page}),
        ...(readPage && {read_page : readPage}),
        ...(rate && {rate : rate}),
        ...(status === '2' && {end_time : currentTime}),
        update_time: currentTime,
        ...(status === '1' && {begin_time: currentTime}),
      })
    .where("id = :id", {id: Number(id)})
    .execute()
  } catch(error) {
    console.log(error);
    res.json({code: 500, data:'', message: 'Update Error'});
  }
  res.json({code: 200, data:'Update Success', message: ''});
})

//GET BOOK BASE INFO
app.post("/getBookInfo", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //query book base info in table book by id
  const { id } = req.body;
  try {
    const bookBaseInfo: Book | null = await AppDataSource
    .getRepository(Book)
    .createQueryBuilder("book")
    .where("book.id = :id", {id: id})
    .getOne();
    if(bookBaseInfo) {
      if(bookBaseInfo.is_delete === 1) {
        res.json({code: 500, data: '', message: 'Book is Deleted'});
      } else {
        const bookBaseInfoData: book = {
          id: bookBaseInfo.id,
          updateTime: bookBaseInfo.update_time,
          createTime: bookBaseInfo.create_time,
          beginTime: bookBaseInfo.begin_time,
          endTime: bookBaseInfo.end_time,
          //0: unread, 1: in progress, 2: finished
          status: bookBaseInfo.status,
          author: bookBaseInfo.author,
          page: bookBaseInfo.page,
          readPage: bookBaseInfo.read_page,
          bookName: bookBaseInfo.book_name,
          isDelete: bookBaseInfo.is_delete,
          deleteTime: bookBaseInfo.delete_time,
          picUrl: bookBaseInfo.pic_url,
          rate: bookBaseInfo.rate
        }
        res.json({code: 200, data: bookBaseInfoData, message: ''});
      }
    } else {
      res.json({code : 500, data: '', message: 'Book Not Found'});
    }
  } catch(error) {
    console.log(error);
    res.json({code: 500, data: '', message: `${error}`});
  }
}) 

//BOOK NOTES
//ADD BOOK NOTES ITEM
app.post("/addBookNotes", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //add new book notes
  const { content, bookId } = req.body;
  const id: string = snowflake.generate();
  const currentTime = moment().format("YYYY-MM-DD");
  const newBookNotes = new BookNotes();
  newBookNotes.id = Number(id);
  newBookNotes.book_id = Number(bookId);
  newBookNotes.content = content;
  newBookNotes.user_id = Number(userId);
  newBookNotes.create_date = currentTime;
  newBookNotes.is_delete = 0;
  try {
    await AppDataSource.manager.save(newBookNotes);
    console.log("New Book notes has been saved. Add time is", newBookNotes.create_date);
  } catch(error) {
    console.log(error);
    res.json({code: 500, data: "Add Error!", message: `${error}`})
  }
  res.json({code: 200, data: "Add Success", message: ''});
})

//GET BOOK NOTES DATA
app.post("/getBookNotes", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //get book notes list
  const { pageNum, pageSize, bookId } = req.body;
  try {
    const bookNotesList: Array<BookNotes> | null = await AppDataSource
    .getRepository(BookNotes)
    .createQueryBuilder("bookNotes")
    .where("user_id = :userId", {userId: userId})
    .andWhere("book_id = :bookId", {bookId: bookId})
    .andWhere("is_delete = 0")
    .skip((pageNum - 1) * pageSize)
    .take(pageSize)
    .orderBy("coalesce(bookNotes.update_time, bookNotes.create_date)", "DESC")
    .getMany();
    const bookNotesData: Array<bookNotes> = bookNotesList.map((item: BookNotes, index: number) => {
      return {
        id: item.id,
        bookId: item.book_id,
        content: item.content,
        createDate: item.create_date,
        updateTime: item.update_time,
        isDelete: item.is_delete,
        deleteTime: item.delete_time,
      }
    });
    res.json({code: 200, data: bookNotesData, message: ''});
  } catch(error) {
    res.json({code: 500, data: '', message: error});
  }
})

//DELETE BOOK NOTE
app.post("/deleteBookNote", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //delete book note by id
  const { id } = req.body;
  const currentTime = moment().format("YYYY-MM-DD hh:mm:ss");
  try {
    await AppDataSource
    .createQueryBuilder()
    .update(BookNotes)
    .set({is_delete: 1, delete_time: currentTime})
    .where("id = :id", {id: Number(id)})
    .execute()
    res.json({code: 200, data: 'Delete Success', message: ''});
  } catch(error) {
    res.json({code: 500, data: 'Delete Error', message: error});
  }
})

app.post("/updateBookNote", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //update book note
  const { id, content } = req.body;
  const currentTime = moment().format("YYYY-MM-DD hh:mm:ss");
  try {
    await AppDataSource
    .createQueryBuilder()
    .update(BookNotes)
    .set({content: content, update_time: currentTime})
    .where("id = :id", {id: Number(id)})
    .execute();
    res.json({code: 200, data: 'Update Success', message: ''});
  } catch(error) {
    res.json({code: 500, data: 'Update Error', message: error});
  }
})

//BOOK QUOTE
//ADD NEW BOOK QUOTE
app.post("/addNewQuote", async (req: Request,  res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //add new book quote
  const { content, bookId, review } = req.body;
  const id: string = snowflake.generate();
  const currentTime = moment().format("YYYY-MM-DD");
  const newBookQuote = new BookQuote();
  newBookQuote.id = Number(id);
  newBookQuote.book_id = Number(bookId);
  newBookQuote.content = content;
  newBookQuote.user_id = Number(userId);
  newBookQuote.create_date = currentTime;
  newBookQuote.review = review;
  newBookQuote.is_delete = 0;
  try {
    await AppDataSource.manager.save(newBookQuote);
    console.log("New Book quote has been saved. Add time is", newBookQuote.create_date);
  } catch(error) {
    console.log(error);
    res.json({code: 500, data: "Add Error!", message: `${error}`})
  }
  res.json({code: 200, data: "Add Success", message: ''});
})

//GET BOOK QUOTE LIST
app.post("/queryBookQuotes", async (req: Request, res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //get book notes list
  const { pageNum, pageSize, bookId } = req.body;
  try {
    const bookNotesList: Array<BookQuote> | null = await AppDataSource
    .getRepository(BookQuote)
    .createQueryBuilder("bookQuote")
    .where("user_id = :userId", {userId: userId})
    .andWhere("book_id = :bookId", {bookId: bookId})
    .andWhere("is_delete = 0")
    .skip((pageNum - 1) * pageSize)
    .take(pageSize)
    .orderBy("coalesce(bookQuote.update_time, bookQuote.create_date)", "DESC")
    .getMany();
    const bookQuotesData: Array<bookQuote> = bookNotesList.map((item: BookQuote, index: number) => {
      return {
        id: item.id,
        bookId: item.book_id,
        review: item.review,
        content: item.content,
        createDate: item.create_date,
        updateTime: item.update_time,
        isDelete: item.is_delete,
        deleteTime: item.delete_time,
      }
    });
    res.json({code: 200, data: bookQuotesData, message: ''});
  } catch(error) {
    res.json({code: 500, data: '', message: error});
  }
})

//EDIT BOOK QUOTE
app.post("/editBookQuote", async (req: Request, res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //update book note
  const { id, content, review } = req.body;
  const currentTime = moment().format("YYYY-MM-DD hh:mm:ss");
  try {
    await AppDataSource
    .createQueryBuilder()
    .update(BookNotes)
    .set({content: content, review: review, update_time: currentTime})
    .where("id = :id", {id: Number(id)})
    .execute();
    res.json({code: 200, data: 'Update Success', message: ''});
  } catch(error) {
    res.json({code: 500, data: 'Update Error', message: error});
  }
})

//DELETE BOOK QUOTE
app.post("/deleteBookQuote", async (req: Request, res: Response) => {
  //Authenrization
  const token = req.headers.authorization;
  const userId: string | boolean = getUserId(token);
  if(!userId) {
    return res.json({code: 503, data:'', message: 'Please Log In first'});
  }
  //delete book note by id
  const { id } = req.body;
  const currentTime = moment().format("YYYY-MM-DD hh:mm:ss");
  try {
    await AppDataSource
    .createQueryBuilder()
    .update(BookQuote)
    .set({is_delete: 1, delete_time: currentTime})
    .where("id = :id", {id: Number(id)})
    .execute()
    res.json({code: 200, data: 'Delete Success', message: ''});
  } catch(error) {
    res.json({code: 500, data: 'Delete Error', message: error});
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});