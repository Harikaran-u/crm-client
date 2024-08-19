import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-main-container">
      <h1 className="home-head">
        Welcome to, <span className="level-up-head">Level Up!</span>
      </h1>
      <p className="home-description">
        A comprehensive tool designed to streamline your business operations.
        Our platform provides robust customer management features, allowing you
        to easily add, update, and secure customer data.
        <br />
        It also excels in lead tracking, automatically converting leads into
        customers upon successful sale.
        <br />
        Our advanced sales analytics tools offer insights into performance
        trends and generate detailed reports.
        <br />
        while integrated feedback management functionalities collect and analyze
        customer feedback to enhance satisfaction and service quality.
        <br />
        Transform your customer relationships and business efficiency with our
        all-in-one CRM solution.
      </p>
    </div>
  );
};

export default Home;
