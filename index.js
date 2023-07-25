import express from "express";
import bodyParser from "body-parser";
import path from "path";
import {fileURLToPath} from "url";
import mongoose from "mongoose";
import __ from "lodash";

main().catch(err => console.log(err));

async function main() {
    const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.set('view engine', 'ejs');

    app.use(express.static(__dirname + "/public"));

    app.use(bodyParser.urlencoded({extended: true}));

    await mongoose.connect("mongodb://127.0.0.1:27017/ItemChewy");
    console.log("Connected");

    const itemsSchema = {
        idItem: String,
        name: String,
        description: String,
        author: String,
        unitPrice: String,
        unit: String,
        price: String
    };

    const Item = mongoose.model("Item", itemsSchema);

    // console.log(Item.find());

    app.get("/", (req, res) => {
        Item.find()
        .then(function (foundItems) {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItem)
                    .then(function () {
                        console.log("Successfully saved default items in DB.");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                    res.redirect("/");
            } else {
                res.render("index"); //render(kết xuất) 1 tệp được gọi là danh sách(list) và chúng ta sẽ chuyển tệp đó thành 1 biến có tên là kindOfDay và giá trị sẽ bằng bất kỳ giá trị nào của biến hiện tại của chúng ta là ngày.Chúng ta đang tạo phản hồi của mình bằng cách render  1 tiệp có tên là List(trong thư mục views) xem nó có phải phần mở rộng không?. Sau đó vào file List -> truyền một biến duy nhất kindOfDay và giá trí cung cấp cho nó là giá trị biến day.
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    });

    app.get("/content", (req,res) => {
        Item.find()
        .then((foundItems) => {
            res.render("content", {name: foundItems})
        })
        .catch(function (err) {
            console.log(err);
        });
    });

    app.post("/", (req,res) => {
        const itemName = req.body.itemName;
        const idItem = req.body.idItem;
        const desItem = req.body.desItem;
        const authorItem = req.body.authorItem;
        const unitPriceItem = req.body.unitPriceItem;
        const unitItem = req.body.unitItem;
        const priceItem = req.body.priceItem;
        // console.log(itemName);
        const item = new Item ({
            idItem: idItem,
            name: itemName,
            description: desItem,
            author: authorItem,
            unitPrice: unitPriceItem,
            unit: unitItem,
            price: priceItem
        });
        item.save()
        .then((e) => {
            console.log("save successfully");
        })
        .catch((err) => {
            console.log(err);
        });

    });

    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is starting on port 3000");
    });
}
