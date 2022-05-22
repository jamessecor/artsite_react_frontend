import React from 'react';
import { storeItemsArray } from '../../data/store.js';
import StoreItem from './StoreItem';

const Store = () => (
    <React.Fragment>
        {Object.values(storeItemsArray).map((storeItem) => <StoreItem title={storeItem.title} itemNumber={storeItem.itemNumber} imageSrc={storeItem.imageSrc} />)}
    </React.Fragment>
);

export default Store;
//     <div class="spacer-row"></div>
// <div class="row">
//     <div id="store-heading" class="col-lg-10 offset-lg-1 text-center">
// 		Online Store to Benefit the <a target="_blank" class="press-links" href="https://eji.org/">Equal Justice Initiative</a>. 
//         <br/>100% of sales go to the Equal Justice Initiative.
//     </div>
// </div>
// <div class="spacer-row"></div>
// <div class="row">
//     <div class="col-lg-10 offset-lg-1" id="store-items"></div>
// </div>
// <script>
//     var storeItemsArray = [
//         {
//             "imgSrc": "http://jamessecor.com/img/TreesontheNorthBranch2016.jpg",
//             "itemNumber": "1",
//             "title": "Trees on the North Branch"
//         },
//         {
//             "imgSrc": "http://jamessecor.com/img/teacup.jpg",
//             "itemNumber": "5",
//             "title": "Espresso at Art Hop"
//         },
//         {
//             "imgSrc": "http://jamessecor.com/img/IMG_20200308_112616.jpg",
//             "itemNumber": "2",
//             "title": "Modern Social Hour II"
//         },
//         {
//             "imgSrc": "http://jamessecor.com/img/animalMug_dish_andGlass_I.jpg",
//             "itemNumber": "3",
//             "title": "animal mug, dish, and glass I"
//         },        
//         {
//             "imgSrc": "http://jamessecor.com/img/FadingLight2016.jpg",
//             "itemNumber": "7",
//             "title": "Fading Light"
//         },
//         {
//             "imgSrc": "http://jamessecor.com/img/IMG_20191207_102302.jpg",
//             "itemNumber": "6",
//             "title": "animal mug, dish, and glass II"
//         },        
//         {
//             "imgSrc": "http://jamessecor.com/img/TrademoreShoppingCenter2017.jpg",
//             "itemNumber": "8",
//             "title": "Trademore Shopping Center"
//         },
//         {
//             "imgSrc": "http://jamessecor.com/img/DeliveryCorridor2018.jpg",
//             "itemNumber": "9",
//             "title": "Delivery Corridor"
//         },
//         {
//             "imgSrc": "http://jamessecor.com/img/barcodes2019.jpg",
//             "itemNumber": "4",
//             "title": "Barcodes"
//         },
//         {            
//             "imgSrc": "http://jamessecor.com/img/TreesontheNorthBranch2016.jpg;"
//                         + "http://jamessecor.com/img/teacup.jpg;" 
//                         + "http://jamessecor.com/img/animalMug_dish_andGlass_I.jpg;"
//                         + "http://jamessecor.com/img/IMG_20200308_112616.jpg;"
//                         + "http://jamessecor.com/img/barcodes2019.jpg;"
//                         + "http://jamessecor.com/img/DeliveryCorridor2018.jpg",
//             "itemNumber": "10",
//             "title": "Mix Pack - assorted images"
//         }
        
//     ];

//     function displayStoreItems(dataArray) {
//         var out = '';
//         for(var i = 0; i < dataArray.length; i++) {
//             if(i % 3 == 0) {
//                 out += '<div class="row store-row">';
//             }
//             var imgSources = dataArray[i].imgSrc.split(";");
//             var width = 100 / imgSources.length;
//             out += '<div class="col-lg-4">';
//             for(var j = 0; j < imgSources.length; j++) {
//                 out += '<img width="' + width + '%" src="' + imgSources[j] + '"/>';
//             }
//             
//             if(i % 3 == 2 || i == dataArray.length - 1) {
//                 out += '</div>';
//             }
//         }            
//         document.getElementById("store-items").innerHTML = out;
//         console.log($("#store-items").html());
//     }

//     displayStoreItems(storeItemsArray);
// </script>
// );

// export default Store;