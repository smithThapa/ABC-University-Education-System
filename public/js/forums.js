import axios from 'axios';

export const getAllForums = async forumDiv => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/forums'
    });
    console.log(res.data);

    if (res.data.status == 'success') {
      forums = res.data.data.data;
      res.render('ForumView.pug', { forums });
      //   document.getElementById('forumDiv').innerHTML =
      //     res.data.data.data[0].title;
      //   return (
      //     <div className="App">
      //       {Object.keys(this.data.data).map(key => (
      //         <div className="container">
      //           <span className="left">{key}</span>
      //           <span className="right">
      //             <NumberFormat
      //               value={this.data.data[key]._id}
      //               displayType={'text'}
      //               decimalPrecision={2}
      //               thousandSeparator={true}
      //               prefix={'$'}
      //             />
      //           </span>
      //         </div>
      //       ))}
      //     </div>
      //   );
    }
  } catch (err) {
    res.render('AppErrorPage.pug');
  }
};
