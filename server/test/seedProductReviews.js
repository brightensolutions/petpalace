// test/seedProductReviews.js

/**
 * Standalone script to seed the `reviews` collection.
 * Usage: node test/seedProductReviews.js
 * After it runs, you can delete this file.
 */

const { MongoClient } = require('mongodb');

// 1) Your MongoDB connection URI (with default DB and options)
const uri =
   'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';


console.log('👉 Using MongoDB URI:', uri);

// 2) The reviews data
const reviewsData = [
  { id: 1,  productId: 1, reviewerName: 'Rohan Kumar',    verified: true,  rating: 4.4, title: 'Not bad',        content: 'Could be better.',                               reviewDate: '2024-12-29', helpfulCount: 7  },
  { id: 2,  productId: 1, reviewerName: 'Priya Sharma',   verified: false, rating: 4.9, title: 'Average',        content: 'Highly recommended.',                            reviewDate: '2024-12-30', helpfulCount: 40 },
  { id: 3,  productId: 1, reviewerName: 'Amit Singh',     verified: true,  rating: 4.5, title: 'Good Buy',       content: 'Decent quality for the price.',                  reviewDate: '2024-12-31', helpfulCount: 15 },
  { id: 4,  productId: 1, reviewerName: 'Nisha Patel',    verified: false, rating: 4.0, title: 'Okay Product',   content: 'Met expectations',                                reviewDate: '2025-01-01', helpfulCount: 22 },
  { id: 5,  productId: 1, reviewerName: 'Rajesh Gupta',   verified: true,  rating: 4.7, title: 'Fantastic!',     content: 'Absolutely love this product.',                   reviewDate: '2025-01-02', helpfulCount: 30 },
  { id: 6,  productId: 1, reviewerName: 'Kavita Devi',    verified: true,  rating: 4.2, title: 'Fine',           content: 'Nothing special',                                 reviewDate: '2025-04-18', helpfulCount: 9  },
  { id: 7,  productId: 1, reviewerName: 'Rahul Jain',     verified: false, rating: 4.6, title: 'Worth It',       content: 'Exceeded my expectations slightly.',              reviewDate: '2025-04-19', helpfulCount: 18 },
  { id: 8,  productId: 1, reviewerName: 'Deepika Rao',    verified: true,  rating: 4.8, title: 'Excellent Choice', content: 'So glad I bought this',                          reviewDate: '2025-02-07', helpfulCount: 33 },
  { id: 9,  productId: 2, reviewerName: 'Sanjay Verma',   verified: true,  rating: 4.0, title: 'Excellent Value', content: 'Value for money. Buying again soon.',             reviewDate: '2025-02-08', helpfulCount: 50 },
  { id:10,  productId: 2, reviewerName: 'Geeta Iyer',     verified: true,  rating: 4.6, title: 'Superb Product', content: 'Highly recommended to all.',                     reviewDate: '2025-02-09', helpfulCount: 35 },
  { id:11,  productId: 2, reviewerName: 'Anjali Bose',    verified: true,  rating: 4.2, title: 'Good Value',      content: 'Happy with the purchase and delivery speed.',     reviewDate: '2025-02-10', helpfulCount: 45 },
  { id:12,  productId: 2, reviewerName: 'Vikram Yadav',   verified: false, rating: 4.8, title: 'Must Buy!',       content: 'Very impressed with the performance and durability.', reviewDate: '2025-02-11', helpfulCount: 28 },
  { id:13,  productId: 2, reviewerName: 'Pooja Das',      verified: true,  rating: 4.3, title: 'Solid Product',   content: 'Does what it says',                             reviewDate: '2025-03-01', helpfulCount: 38 },
  { id:14,  productId: 2, reviewerName: 'Arjun Reddy',    verified: true,  rating: 4.9, title: 'Simply Superb!',  content: 'The best in its category',                      reviewDate: '2024-09-05', helpfulCount: 55 },
  { id:15,  productId: 2, reviewerName: 'Neha Kapoor',    verified: false, rating: 4.1, title: 'Satisfied Customer', content: 'Good for the price',                           reviewDate: '2025-04-20', helpfulCount: 20 },
  { id:16,  productId: 2, reviewerName: 'Dhruv Mehta',    verified: true,  rating: 4.7, title: 'Highly Impressed', content: 'Quality and features are top-notch',           reviewDate: '2024-12-12', helpfulCount: 40 },
  { id:17,  productId: 3, reviewerName: 'Rohan Prakash',  verified: true,  rating: 4.7, title: 'Great Product',    content: 'Value for money. Works perfectly.',             reviewDate: '2024-12-13', helpfulCount: 16 },
  { id:18,  productId: 3, reviewerName: 'Shruti Nair',    verified: false, rating: 4.6, title: 'Excellent Quality', content: 'Great value for money',                         reviewDate: '2025-03-10', helpfulCount: 28 },
  { id:19,  productId: 3, reviewerName: 'Kunal Dixit',    verified: true,  rating: 4.5, title: 'Good Purchase',    content: 'Does the job well',                              reviewDate: '2025-01-05', helpfulCount: 20 },
  { id:20,  productId: 3, reviewerName: 'Sarika Rao',     verified: true,  rating: 4.8, title: 'Amazing!',         content: 'So happy with this purchase',                    reviewDate: '2024-11-15', helpfulCount: 32 },
  { id:21,  productId: 3, reviewerName: 'Varun Shah',     verified: false, rating: 4.3, title: 'Decent Buy',       content: 'No complaints so far',                          reviewDate: '2025-04-01', helpfulCount: 10 },
  { id:22,  productId: 3, reviewerName: 'Meera Kumar',    verified: true,  rating: 4.9, title: 'Absolutely Perfect!', content: 'Exactly what I needed',                     reviewDate: '2024-08-01', helpfulCount: 25 },
  { id:23,  productId: 3, reviewerName: 'Gaurav Singh',   verified: false, rating: 4.6, title: 'Satisfied',        content: 'Reliable and efficient',                        reviewDate: '2025-05-10', helpfulCount: 18 },
  { id:24,  productId: 3, reviewerName: 'Ishita Sharma',  verified: true,  rating: 4.7, title: 'Top-Notch',        content: 'Highly recommend to anyone looking for this.',  reviewDate: '2025-05-11', helpfulCount: 24 },
  { id:25,  productId: 4, reviewerName: 'Aisha Khan',     verified: false, rating: 4.2, title: 'Great Product',    content: 'very useful.',                                  reviewDate: '2025-01-24', helpfulCount: 47 },
  { id:26,  productId: 4, reviewerName: 'Imran Ali',      verified: true,  rating: 4.8, title: 'Quality Product',  content: 'sturdy build.',                                  reviewDate: '2024-09-24', helpfulCount: 20 },
  { id:27,  productId: 4, reviewerName: 'Farah Ahmed',    verified: true,  rating: 4.5, title: 'Good Buy',         content: 'worth the price.',                               reviewDate: '2024-11-03', helpfulCount: 30 },
  { id:28,  productId: 4, reviewerName: 'Zahid Hussain',  verified: false, rating: 4.1, title: 'Average Performer', content: 'Could be better but acceptable for the cost.', reviewDate: '2024-11-04', helpfulCount: 15 },
  { id:29,  productId: 4, reviewerName: 'Sana Begum',     verified: true,  rating: 4.9, title: 'Excellent!',       content: 'Pleasantly surprised by the quality and features.', reviewDate: '2024-11-05', helpfulCount: 40 },
  { id:30,  productId: 4, reviewerName: 'Adnan Malik',    verified: true,  rating: 4.3, title: 'Works Well',       content: 'performs reliably.',                            reviewDate: '2025-02-08', helpfulCount: 25 },
  { id:31,  productId: 4, reviewerName: 'Nida Siddiqui',  verified: false, rating: 4.6, title: 'Recommended',      content: 'A worthwhile investment for sure.',              reviewDate: '2025-02-09', helpfulCount: 35 },
  { id:32,  productId: 4, reviewerName: 'Bilal Khan',     verified: true,  rating: 4.7, title: 'Love It!',         content: 'Performs exactly as described',                 reviewDate: '2025-04-25', helpfulCount: 22 },
  { id:33,  productId: 5, reviewerName: 'Priya Singh',    verified: false, rating: 4.5, title: 'Great Product',    content: 'Good quality and fast delivery.',               reviewDate: '2025-04-26', helpfulCount: 45 },
  { id:34,  productId: 5, reviewerName: 'Vivek Gupta',    verified: true,  rating: 4.4, title: 'Loved It',         content: 'Good quality and fast delivery. Very happy.',    reviewDate: '2025-04-27', helpfulCount: 41 },
  { id:35,  productId: 5, reviewerName: 'Ananya Sharma',  verified: true,  rating: 4.6, title: 'Excellent',        content: 'Packaging was secure and product arrived intact.', reviewDate: '2025-04-28', helpfulCount: 38 },
  { id:36,  productId: 5, reviewerName: 'Arjun Kumar',     verified: false, rating: 4.2, title: 'Satisfied',        content: 'Received on time and in good condition.',        reviewDate: '2025-04-29', helpfulCount: 20 },
  { id:37,  productId: 5, reviewerName: 'Kirti Jain',      verified: true,  rating: 4.7, title: 'Impressed',        content: 'Delivery was super quick! Product is great.',    reviewDate: '2025-04-30', helpfulCount: 50 },
  { id:38,  productId: 5, reviewerName: 'Manish Patel',    verified: true,  rating: 4.3, title: 'Decent',          content: 'Value for its price',                           reviewDate: '2024-09-29', helpfulCount: 30 },
  { id:39,  productId: 5, reviewerName: 'Divya Reddy',     verified: false, rating: 4.5, title: 'Happy User',      content: 'Product matched description',                    reviewDate: '2025-04-14', helpfulCount: 40 },
  { id:40,  productId: 5, reviewerName: 'Rajat Verma',     verified: true,  rating: 4.8, title: 'Best Ever!',      content: 'Flawless experience from order to delivery.',    reviewDate: '2025-04-15', helpfulCount: 48 },
  { id:41,  productId: 6, reviewerName: 'Simran Kaur',     verified: true,  rating: 4.7, title: 'Loved It',        content: 'My pet likes it very much. A great buy!',       reviewDate: '2025-04-16', helpfulCount: 42 },
  { id:42,  productId: 6, reviewerName: 'Kabir Singh',     verified: false, rating: 4.6, title: 'Not Bad',         content: 'Good quality and fast delivery',                reviewDate: '2025-04-17', helpfulCount: 48 },
  { id:43,  productId: 6, reviewerName: 'Rani Devi',       verified: true,  rating: 4.5, title: 'Pet Approved',    content: 'My furry friend is absolutely thrilled!',       reviewDate: '2025-04-18', helpfulCount: 35 },
  { id:44,  productId: 6, reviewerName: 'Soham Joshi',     verified: false, rating: 4.8, title: 'Fantastic for Pets', content: 'My dog goes crazy for it',                    reviewDate: '2025-04-19', helpfulCount: 55 },
  { id:45,  productId: 6, reviewerName: 'Akash Dubey',     verified: true,  rating: 4.3, title: 'Decent',         content: 'My cat gives it a definite paws up.',          reviewDate: '2025-04-20', helpfulCount: 28 },
  { id:46,  productId: 6, reviewerName: 'Mansi Gupta',     verified: true,  rating: 4.9, title: 'Highly Recommend', content: 'Perfect for my pet\'s needs and easy to use.', reviewDate: '2025-04-21', helpfulCount: 60 },
  { id:47,  productId: 6, reviewerName: 'Vivek Nair',      verified: false, rating: 4.1, title: 'It\'s Okay',    content: 'Not their favorite but fine.',                 reviewDate: '2024-10-02', helpfulCount: 20 },
  { id:48,  productId: 6, reviewerName: 'Priyanka Das',    verified: true,  rating: 4.7, title: 'Happy Pet',       content: 'Couldn’t be happier.',                         reviewDate: '2025-03-27', helpfulCount: 25 },
  { id:49,  productId: 7, reviewerName: 'Aditya Sharma',   verified: true,  rating: 4.0, title: 'Great Product',   content: 'But not deal-breaking.',                        reviewDate: '2025-03-28', helpfulCount: 22 },
  { id:50,  productId: 7, reviewerName: 'Siddharth Jain',  verified: true,  rating: 4.1, title: 'Good Product',    content: 'Very pleased.',                                 reviewDate: '2025-03-29', helpfulCount: 3  },
  { id:51,  productId: 7, reviewerName: 'Pooja Singh',     verified: true,  rating: 4.3, title: 'Pet\'s Favorite', content: 'A fantastic purchase!',                       reviewDate: '2025-03-30', helpfulCount: 18 },
  { id:52,  productId: 7, reviewerName: 'Karan Verma',     verified: false, rating: 4.6, title: 'Good for Pets',   content: 'Very useful.',                                  reviewDate: '2025-02-05', helpfulCount: 28 },
  { id:53,  productId: 7, reviewerName: 'Ritika Patel',    verified: true,  rating: 4.8, title: 'Excellent Buy',    content: 'Highly satisfied.',                            reviewDate: '2024-08-08', helpfulCount: 32 },
  { id:54,  productId: 7, reviewerName: 'Ankit Gupta',     verified: true,  rating: 4.0, title: 'Just Fine',       content: 'No issues.',                                    reviewDate: '2025-03-01', helpfulCount: 15 },
  { id:55,  productId: 7, reviewerName: 'Shreya Rao',      verified: false, rating: 4.5, title: 'Satisfied',       content: 'Good product.',                                 reviewDate: '2024-10-20', helpfulCount: 25 },
  { id:56,  productId: 7, reviewerName: 'Gaurav Kumar',    verified: true,  rating: 4.7, title: 'Must Buy for Pets', content: 'Definitely recommend.',                       reviewDate: '2025-04-10', helpfulCount: 30 },
  { id:57,  productId: 8, reviewerName: 'Sonam Singh',     verified: true,  rating: 4.3, title: 'Loved It',        content: 'A hit with my little one',                     reviewDate: '2025-04-11', helpfulCount: 7  },
  { id:58,  productId: 8, reviewerName: 'Ravi Kumar',      verified: false, rating: 5.0, title: 'Not Bad',         content: 'But still a decent item.',                     reviewDate: '2025-04-12', helpfulCount: 17 },
  { id:59,  productId: 8, reviewerName: 'Sneha Gupta',     verified: true,  rating: 4.6, title: 'Pet\'s Choice',    content: 'A hit with my little one',                     reviewDate: '2025-04-13', helpfulCount: 10 },
  { id:60,  productId: 8, reviewerName: 'Alok Sharma',     verified: true,  rating: 4.1, title: 'It\'s Alright',   content: 'Fair purchase.',                               reviewDate: '2025-04-14', helpfulCount: 5  },
  { id:61,  productId: 8, reviewerName: 'Preeti Das',      verified: false, rating: 4.9, title: 'Amazing',         content: 'Excellent product!',                           reviewDate: '2024-09-20', helpfulCount: 20 },
  { id:62,  productId: 8, reviewerName: 'Amit Kumar',      verified: true,  rating: 4.4, title: 'Pretty Good',     content: 'Works well.',                                  reviewDate: '2025-03-12', helpfulCount: 12 },
  { id:63,  productId: 8, reviewerName: 'Naina Verma',     verified: true,  rating: 4.7, title: 'Fantastic',       content: 'A great addition.',                             reviewDate: '2024-08-01', helpfulCount: 15 },
  { id:64,  productId: 8, reviewerName: 'Jatin Singh',     verified: false, rating: 4.2, title: 'Okayish',         content: 'But it\'s usable.',                            reviewDate: '2025-04-28', helpfulCount: 8  },
  { id:65,  productId: 9, reviewerName: 'Kishan Reddy',    verified: true,  rating: 4.5, title: 'Average',         content: 'But it\'s alright for the price.',              reviewDate: '2024-11-03', helpfulCount: 6  },
  { id:66,  productId: 9, reviewerName: 'Radha Sharma',    verified: false, rating: 4.5, title: 'Average',         content: 'Expected more.',                               reviewDate: '2024-12-07', helpfulCount: 35 },
  { id:67,  productId: 9, reviewerName: 'Harish Patel',    verified: true,  rating: 4.0, title: 'Just Okay',       content: 'A hit with my little one',                     reviewDate: '2024-12-08', helpfulCount: 10 },
  { id:68,  productId: 9, reviewerName: 'Shalini Devi',    verified: true,  rating: 4.2, title: 'Could Improve',   content: 'A hit with my little one',                     reviewDate: '2024-12-09', helpfulCount: 8  },
  { id:69,  productId: 9, reviewerName: 'Deepak Singh',    verified: false, rating: 4.7, title: 'Better Than Expected', content: 'Pleasantly surprised.',                     reviewDate: '2024-12-10', helpfulCount: 20 },
  { id:70,  productId: 9, reviewerName: 'Amrita Rao',      verified: true,  rating: 4.3, title: 'Fair Enough',     content: 'But not deal-breaking.',                      reviewDate: '2024-12-11', helpfulCount: 12 },
  { id:71,  productId: 9, reviewerName: 'Vivek Dubey',     verified: true,  rating: 4.6, title: 'Surprisingly Good', content: 'Very pleased.',                              reviewDate: '2024-12-12', helpfulCount: 15 },
  { id:72,  productId: 9, reviewerName: 'Bhavna Jain',     verified: false, rating: 4.4, title: 'Almost There',    content: 'A hit with my little one',                     reviewDate: '2024-12-13', helpfulCount: 7  },
  { id:73,  productId:10, reviewerName: 'Sachin Kumar',    verified: false, rating: 4.2, title: 'Loved It',        content: 'But still a good product.',                   reviewDate: '2024-12-14', helpfulCount: 18 },
  { id:74,  productId:10, reviewerName: 'Rashmi Singh',    verified: true,  rating: 4.1, title: 'Average',         content: 'A hit with my little one',                     reviewDate: '2024-12-15', helpfulCount: 48 },
  { id:75,  productId:10, reviewerName: 'Mahesh Sharma',   verified: true,  rating: 4.5, title: 'Good Value',      content: 'It\'s a decent buy.',                          reviewDate: '2024-11-19', helpfulCount: 30 },
  { id:76,  productId:10, reviewerName: 'Sonia Patel',     verified: false, rating: 4.3, title: 'Okay Product',    content: 'But usable.',                                  reviewDate: '2025-01-06', helpfulCount: 25 },
  { id:77,  productId:10, reviewerName: 'Arun Gupta',      verified: true,  rating: 4.7, title: 'Solid Choice',    content: 'Works well.',                                  reviewDate: '2024-09-15', helpfulCount: 40 },
  { id:78,  productId:10, reviewerName: 'Meena Devi',      verified: false, rating: 4.0, title: 'Just Average',    content: 'Nothing special.',                             reviewDate: '2025-03-25', helpfulCount: 15 },
  { id:79,  productId:10, reviewerName: 'Kapil Jain',      verified: true,  rating: 4.6, title: 'Impressive',      content: 'Nothing special.',                             reviewDate: '2025-03-26', helpfulCount: 35 },
  { id:80,  productId:10, reviewerName: 'Sheetal Rao',     verified: true,  rating: 4.8, title: 'Fantastic',       content: 'Very satisfied customer.',                     reviewDate: '2025-03-27', helpfulCount: 50 },
  { id:81,  productId:11, reviewerName: 'Ashok Kumar',     verified: true,  rating: 4.1, title: 'Excellent',       content: 'But not deal-breaking.',                        reviewDate: '2025-03-28', helpfulCount: 12 },
  { id:82,  productId:11, reviewerName: 'Shilpa Singh',    verified: false, rating: 4.6, title: 'Great Product',   content: 'Very pleased.',                                 reviewDate: '2025-03-29', helpfulCount: 7  },
  { id:83,  productId:11, reviewerName: 'Rohit Sharma',    verified: true,  rating: 4.5, title: 'Quick Delivery',  content: 'Impressed.',                                    reviewDate: '2024-12-28', helpfulCount: 18 },
  { id:84,  productId:11, reviewerName: 'Gayatri Patel',   verified: false, rating: 4.0, title: 'Decent Quality',  content: 'Seems durable.',                                reviewDate: '2025-01-20', helpfulCount: 10 },
  { id:85,  productId:11, reviewerName: 'Anand Gupta',     verified: true,  rating: 4.8, title: 'Love the Quality', content: 'Feels premium.',                               reviewDate: '2024-09-05', helpfulCount: 25 },
  { id:86,  productId:11, reviewerName: 'Nisha Devi',      verified: false, rating: 4.2, title: 'Average',         content: 'Just a product.',                               reviewDate: '2025-04-01', helpfulCount: 8  },
  { id:87,  productId:11, reviewerName: 'Kiran Jain',      verified: true,  rating: 4.7, title: 'Highly Satisfied', content: 'Will buy again.',                              reviewDate: '2024-10-15', helpfulCount: 20 },
  { id:88,  productId:11, reviewerName: 'Varsha Rao',      verified: false, rating: 4.4, title: 'Good Buy',        content: 'Happy with it.',                                reviewDate: '2025-02-10', helpfulCount: 15 },
  { id:89,  productId:12, reviewerName: 'Preeti Sharma',   verified: false, rating: 4.1, title: 'Excellent',       content: 'Nothing special.',                              reviewDate: '2025-02-11', helpfulCount: 49 },
  { id:90,  productId:12, reviewerName: 'Rakesh Kumar',    verified: true,  rating: 4.6, title: 'Not Bad',         content: 'Pets are happy.',                               reviewDate: '2025-02-12', helpfulCount: 19 },
  { id:91,  productId:12, reviewerName: 'Ankita Singh',    verified: true,  rating: 4.5, title: 'Pet\'s Favorite', content: 'Highly recommend.',                             reviewDate: '2025-02-13', helpfulCount: 25 },
  { id:92,  productId:12, reviewerName: 'Sumit Patel',     verified: false, rating: 4.2, title: 'Good for Pets',   content: 'Nothing special.',                              reviewDate: '2025-02-14', helpfulCount: 15 },
  { id:93,  productId:12, reviewerName: 'Shruti Gupta',    verified: true,  rating: 4.8, title: 'Highly Recommend', content: 'Fantastic item!',                             reviewDate: '2025-02-15', helpfulCount: 30 },
  { id:94,  productId:12, reviewerName: 'Gautam Devi',     verified: false, rating: 4.0, title: 'Okay for Pets',   content: 'Serves its purpose.',                            reviewDate: '2025-02-16', helpfulCount: 10 },
  { id:95,  productId:12, reviewerName: 'Piyush Jain',     verified: true,  rating: 4.7, title: 'Pet Approved',    content: 'Very satisfied.',                               reviewDate: '2025-02-17', helpfulCount: 28 },
  { id:96,  productId:12, reviewerName: 'Poonam Rao',      verified: true,  rating: 4.9, title: 'Absolutely Fantastic!', content: 'Best purchase!',                            reviewDate: '2025-02-18', helpfulCount: 35 },
  { id:97,  productId:13, reviewerName: 'Vikram Singh',    verified: false, rating: 4.2, title: 'Great Product',   content: 'But not deal-breaking.',                        reviewDate: '2025-02-19', helpfulCount: 21 },
  { id:98,  productId:13, reviewerName: 'Deepak Sharma',   verified: true,  rating: 4.8, title: 'Loved It',        content: 'Very pleased.',                                 reviewDate: '2025-02-20', helpfulCount: 25 },
  { id:99,  productId:13, reviewerName: 'Priya Gupta',     verified: true,  rating: 4.5, title: 'Pet Friendly',    content: 'Fantastic item!',                               reviewDate: '2025-02-21', helpfulCount: 18 },
  { id:100, productId:13, reviewerName: 'Rahul Devi',     verified: false, rating: 4.1, title: 'Good for Pets',   content: 'No complaints.',                                reviewDate: '2025-01-02', helpfulCount: 12 },
  { id:101, productId:13, reviewerName: 'Shweta Jain',    verified: true,  rating: 4.7, title: 'Top Pet Product', content: 'My pet loves it.',                              reviewDate: '2024-12-18', helpfulCount: 28 },
  { id:102, productId:13, reviewerName: 'Ankit Rao',      verified: true,  rating: 4.3, title: 'Fine for Pets',   content: 'Works well.',                                   reviewDate: '2025-03-05', helpfulCount: 15 },
  { id:103, productId:13, reviewerName: 'Kriti Patel',    verified: false, rating: 4.6, title: 'Excellent Choice', content: 'Good value.',                                reviewDate: '2024-08-15', helpfulCount: 22 },
  { id:104, productId:13, reviewerName: 'Sandeep Verma',  verified: true,  rating: 4.9, title: 'Absolute Hit!',   content: 'Highly addictive for them.',                    reviewDate: '2025-04-20', helpfulCount: 30 },
  { id:105, productId:14, reviewerName: 'Manish Kumar',  verified: true,  rating: 5.0, title: 'Excellent',       content: 'But not deal-breaking.',                        reviewDate: '2025-04-21', helpfulCount: 11 },
  { id:106, productId:14, reviewerName: 'Swati Singh',    verified: false, rating: 4.8, title: 'Excellent',       content: 'Very pleased.',                                 reviewDate: '2025-04-22', helpfulCount: 44 },
  { id:107, productId:14, reviewerName: 'Akash Sharma',   verified: true,  rating: 4.7, title: 'Best Value',      content: 'Highly economical and performs well.',          reviewDate: '2025-04-23', helpfulCount: 20 },
  { id:108, productId:14, reviewerName: 'Megha Patel',    verified: true,  rating: 4.9, title: 'Great Deal',      content: 'Truly impressed.',                              reviewDate: '2025-04-24', helpfulCount: 30 },
  { id:109, productId:14, reviewerName: 'Vinay Gupta',    verified: true,  rating: 4.6, title: 'Economical',      content: 'But not deal-breaking.',                        reviewDate: '2025-04-25', helpfulCount: 15 },
  { id:110, productId:14, reviewerName: 'Anushka Devi',   verified: false, rating: 4.5, title: 'Good for Price',  content: 'Very pleased.',                                 reviewDate: '2025-04-26', helpfulCount: 25 },
  { id:111, productId:14, reviewerName: 'Arjun Jain',     verified: true,  rating: 4.8, title: 'Worth Every Penny', content: 'Solid item.',                                reviewDate: '2025-04-27', helpfulCount: 35 },
  { id:112, productId:14, reviewerName: 'Payal Rao',      verified: true,  rating: 5.0, title: 'Unbeatable Value', content: 'Fantastic product.',                          reviewDate: '2025-04-28', helpfulCount: 40 },
  { id:113, productId:15, reviewerName: 'Sameer Kumar',  verified: true,  rating: 4.5, title: 'Not Bad',         content: 'But not deal-breaking.',                        reviewDate: '2025-04-29', helpfulCount: 28 },
  { id:114, productId:15, reviewerName: 'Nikita Singh',  verified: true,  rating: 4.3, title: 'Great Product',   content: 'Very pleased.',                                 reviewDate: '2025-04-30', helpfulCount: 11 },
  { id:115, productId:15, reviewerName: 'Ravi Sharma',    verified: true,  rating: 4.0, title: 'Just Okay',       content: 'But not deal-breaking.',                        reviewDate: '2025-05-01', helpfulCount: 15 },
  { id:116, productId:15, reviewerName: 'Aarti Patel',    verified: false, rating: 4.2, title: 'Room for Improvement', content: 'Very pleased.',                          reviewDate: '2025-05-02', helpfulCount: 20 },
  { id:117, productId:15, reviewerName: 'Vikas Gupta',    verified: true,  rating: 4.6, title: 'Good Effort',     content: 'Hopeful for updates.',                          reviewDate: '2025-05-03', helpfulCount: 30 },
  { id:118, productId:15, reviewerName: 'Deepali Devi',   verified: true,  rating: 4.4, title: 'Decent',        content: 'No frills.',                                    reviewDate: '2025-05-04', helpfulCount: 22 },
  { id:119, productId:15, reviewerName: 'Suresh Jain',    verified: false, rating: 4.1, title: 'Needs Work',      content: 'Needs some tweaks.',                            reviewDate: '2025-02-28', helpfulCount: 10 },
  { id:120, productId:15, reviewerName: 'Amrita Rao',     verified: true,  rating: 4.7, title: 'Promising',      content: 'It could be truly great.',                      reviewDate: '2024-10-17', helpfulCount: 25 },
  { id:121, productId:16, reviewerName: 'Kartik Sharma',  verified: false, rating: 4.6, title: 'Average',        content: 'Seems happy.',                                 reviewDate: '2024-11-16', helpfulCount: 42 },
  { id:122, productId:16, reviewerName: 'Sakshi Singh',   verified: true,  rating: 5.0, title: 'Not Bad',        content: 'Surprised it\'s good.',                         reviewDate: '2024-08-06', helpfulCount: 22 },
  { id:123, productId:16, reviewerName: 'Mohit Patel',    verified: true,  rating: 4.5, title: 'Pet\'s Delight', content: 'But not deal-breaking.',                        reviewDate: '2024-08-07', helpfulCount: 30 },
  { id:124, productId:16, reviewerName: 'Disha Gupta',    verified: false, rating: 4.8, title: 'Highly Recommended', content: 'Very pleased.',                         reviewDate: '2024-08-08', helpfulCount: 38 },
  { id:125, productId:16, reviewerName: 'Ashish Devi',    verified: true,  rating: 4.2, title: 'Okay for Pets',  content: 'But pets use it.',                              reviewDate: '2024-08-09', helpfulCount: 25 },
  { id:126, productId:16, reviewerName: 'Shruti Jain',    verified: true,  rating: 4.9, title: 'Excellent Choice', content: 'They really enjoy it.',                      reviewDate: '2024-08-10', helpfulCount: 45 },
  { id:127, productId:16, reviewerName: 'Prakash Rao',    verified: false, rating: 4.4, title: 'Pet Friendly',   content: 'Good for daily use.',                           reviewDate: '2024-08-11', helpfulCount: 20 },
  { id:128, productId:16, reviewerName: 'Neha Verma',     verified: true,  rating: 4.7, title: 'Happy Pet Owner', content: 'Makes my pet happy.',                         reviewDate: '2024-08-12', helpfulCount: 32 },
  { id:129, productId:17, reviewerName: 'Kunal Kumar',    verified: false, rating: 4.9, title: 'Excellent',       content: 'But not deal-breaking.',                        reviewDate: '2024-08-13', helpfulCount: 35 },
  { id:130, productId:17, reviewerName: 'Priyanka Singh', verified: true,  rating: 4.4, title: 'Loved It',        content: 'Very pleased.',                                 reviewDate: '2024-08-14', helpfulCount: 16 },
  { id:131, productId:17, reviewerName: 'Arjun Sharma',   verified: true,  rating: 4.7, title: 'Great Value',     content: 'Very useful.',                                  reviewDate: '2024-08-15', helpfulCount: 28 },
  { id:132, productId:17, reviewerName: 'Divya Patel',    verified: false, rating: 4.2, title: 'Fair Price',      content: 'No complaints.',                                reviewDate: '2024-11-20', helpfulCount: 10 },
  { id:133, productId:17, reviewerName: 'Ankit Gupta',    verified: true,  rating: 4.8, title: 'Fantastic Buy',   content: 'Truly a gem.',                                  reviewDate: '2025-02-14', helpfulCount: 40 },
  { id:134, productId:17, reviewerName: 'Neha Devi',      verified: true,  rating: 4.3, title: 'Decent',          content: 'Reliable.',                                     reviewDate: '2024-09-08', helpfulCount: 18 },
  { id:135, productId:17, reviewerName: 'Rahul Jain',     verified: false, rating: 4.6, title: 'Solid Purchase',  content: 'Impressed.',                                    reviewDate: '2025-03-28', helpfulCount: 32 },
  { id:136, productId:17, reviewerName: 'Kavita Rao',     verified: true,  rating: 4.9, title: 'Highly Valuable', content: 'You\'ll be glad you did!','reviewDate': '2024-12-07', helpfulCount: 45 },
  { id:137, productId:18, reviewerName: 'Gaurav Kumar',   verified: false, rating: 4.0, title: 'Excellent',       content: 'But not deal-breaking.',                        reviewDate: '2024-12-08', helpfulCount: 50 },
  { id:138, productId:18, reviewerName: 'Sanjana Singh',  verified: true,  rating: 4.3, title: 'Loved It',        content: 'Very pleased.',                                 reviewDate: '2024-12-09', helpfulCount: 25 },
  { id:139, productId:18, reviewerName: 'Vijay Sharma',   verified: true,  rating: 4.5, title: 'Quick Service',   content: 'Very efficient.',                               reviewDate: '2024-12-10', helpfulCount: 35 },
  { id:140, productId:18, reviewerName: 'Meena Patel',    verified: false, rating: 4.2, title: 'Average Quality', content: 'But serves its purpose.',                       reviewDate: '2024-12-11', helpfulCount: 20 },
  { id:141, productId:18, reviewerName: 'Ravi Gupta',     verified: true,  rating: 4.7, title: 'Impressive',      content: 'But not deal-breaking.',                        reviewDate: '2024-12-12', helpfulCount: 40 },
  { id:142, productId:18, reviewerName: 'Tina Devi',      verified: false, rating: 4.1, title: 'Needs Work',      content: 'Very pleased.',                                 reviewDate: '2024-12-13', helpfulCount: 15 },
  { id:143, productId:18, reviewerName: 'Deepika Jain',   verified: true,  rating: 4.8, title: 'Highly Recommended', content: 'Nothing exceptional.',                    reviewDate: '2024-12-14', helpfulCount: 45 },
  { id:144, productId:18, reviewerName: 'Akash Rao',      verified: false, rating: 4.4, title: 'Good Delivery',   content: 'Happy with the purchase.',                      reviewDate: '2024-12-15', helpfulCount: 30 },
  { id:145, productId:19, reviewerName: 'Pankaj Kumar',   verified: false, rating: 4.4, title: 'Not Bad',         content: 'But not deal-breaking.',                        reviewDate: '2024-12-16', helpfulCount: 18 },
  { id:146, productId:19, reviewerName: 'Divya Singh',    verified: false, rating: 4.0, title: 'Not Bad',         content: 'Very pleased.',                                 reviewDate: '2024-12-17', helpfulCount: 47 },
  { id:147, productId:19, reviewerName: 'Siddharth Sharma',verified: true,  rating: 4.2, title: 'Decent',          content: 'Not amazing but functional.',                   reviewDate: '2024-09-14', helpfulCount: 20 },
  { id:148, productId:19, reviewerName: 'Pooja Patel',     verified: true,  rating: 4.6, title: 'Pretty Good',     content: 'But not deal-breaking.',                        reviewDate: '2024-09-15', helpfulCount: 30 },
  { id:149, productId:19, reviewerName: 'Karan Gupta',    verified: false, rating: 4.1, title: 'Could Be Better', content: 'Very pleased.',                                 reviewDate: '2024-09-16', helpfulCount: 10 },
  { id:150, productId:19, reviewerName: 'Shreya Devi',     verified: true,  rating: 4.8, title: 'Excellent Product', content: 'Very pleased.',                              reviewDate: '2024-09-17', helpfulCount: 40 },
  { id:151, productId:19, reviewerName: 'Ankit Jain',      verified: false, rating: 4.3, title: 'Satisfied',       content: 'Nothing exceptional.',                         reviewDate: '2024-07-10', helpfulCount: 25 },
  { id:152, productId:19, reviewerName: 'Aisha Rao',       verified: true,  rating: 4.5, title: 'Good Buy',        content: 'Happy with the purchase.',                      reviewDate: '2025-02-20', helpfulCount: 35 },
  { id:153, productId:20, reviewerName: 'Ashish Kumar',    verified: true,  rating: 4.7, title: 'Great Product',   content: 'But not deal-breaking.',                        reviewDate: '2025-02-21', helpfulCount: 12 },
  { id:154, productId:20, reviewerName: 'Neha Singh',      verified: false, rating: 4.4, title: 'Not Bad',         content: 'Very pleased.',                                 reviewDate: '2025-02-22', helpfulCount: 36 },
  { id:155, productId:20, reviewerName: 'Rahul Sharma',    verified: true,  rating: 4.5, title: 'Pet\'s Choice',    content: 'Nothing exceptional.',                         reviewDate: '2025-02-23', helpfulCount: 20 },
  { id:156, productId:20, reviewerName: 'Priya Patel',     verified: true,  rating: 4.8, title: 'Amazing for Pets', content: 'Happy with the purchase.',                      reviewDate: '2025-02-24', helpfulCount: 30 },
  { id:157, productId:20, reviewerName: 'Vivek Gupta',     verified: true,  rating: 4.2, title: 'Okayish',         content: 'But it\'s used.',                                reviewDate: '2025-02-25', helpfulCount: 15 },
  { id:158, productId:20, reviewerName: 'Anjali Devi',     verified: false, rating: 4.9, title: 'Must-Have',       content: 'But it\'s used.',                                reviewDate: '2025-02-26', helpfulCount: 40 },
  { id:159, productId:20, reviewerName: 'Rohit Jain',      verified: true,  rating: 4.3, title: 'Just Fine',       content: 'No complaints so far.',                          reviewDate: '2025-02-27', helpfulCount: 25 },
  { id:160, productId:20, reviewerName: 'Shweta Rao',      verified: true,  rating: 4.6, title: 'Happy Pet',       content: 'My pet is thriving.',                            reviewDate: '2024-09-01', helpfulCount: 35 },
];

async function run() {
  console.log('🔗 Connecting to MongoDB…');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected');

    const db = client.db();
    const prodColl = db.collection('products');
    const revColl = db.collection('reviews');

    // Drop old collection
    console.log('🗑️  Dropping old reviews collection if it exists…');
    try {
      await db.dropCollection('reviews');
      console.log('🗑️  Dropped existing collection');
    } catch {
      console.log('ℹ️  No existing collection to drop');
    }

    // Seed reviews
    for (const r of reviewsData) {
      const product = await prodColl.findOne({ id: r.productId });
      if (!product) {
        throw new Error(`Product with id ${r.productId} not found`);
      }

      await revColl.insertOne({
        id: r.id,
        product_id: product._id,
        reviewer_name: r.reviewerName,
        verified: r.verified,
        rating: r.rating,
        title: r.title,
        content: r.content,
        review_date: new Date(r.reviewDate),
        helpful_count: r.helpfulCount,
      });
      console.log(`➕ Inserted review #${r.id} for product ${r.productId}`);
    }

    console.log('🎉 All reviews seeded!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
