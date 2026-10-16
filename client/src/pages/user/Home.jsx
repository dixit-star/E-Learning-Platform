
import HeroSection from "../../components/user/HeroSection";
import PopularCourses from "../../components/user/PopularCourses";
import Categories from "../../components/user/Categories";
import WhyChooseUs from "../../components/user/WhyChooseUs";
import TopInstructors from "../../components/user/TopInstructors";

function Home() {
  return (
    <div className="home-page">
      <HeroSection />
      <PopularCourses />
      <Categories />
      <WhyChooseUs />
      <TopInstructors />
    </div>
  );
}

export default Home;
