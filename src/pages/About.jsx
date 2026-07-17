import React from "react";
import {
  Users,
  ShoppingBag,
  Globe,
  Award,
  Truck,
  ShieldCheck,
  Headphones,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Products from './Products';
const stats = [
  {
    icon: Users,
    value: "25K+",
    label: "Happy Customers",
  },
  {
    icon: ShoppingBag,
    value: "12K+",
    label: "Products Available",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries Served",
  },
  {
    icon: Award,
    value: "5+",
    label: "Years of Excellence",
  },
];

const services = [
  {
    icon: Truck,
    title: "Fast & Free Delivery",
    description:
      "We deliver your orders quickly and safely with reliable shipping services across the globe.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Every payment is protected with advanced encryption for a safe and worry-free shopping experience.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description:
      "Our support team is available anytime to help you with your orders and shopping experience.",
  },
];

const About = () => {
    const navigate = useNavigate()
  return (
    <div className="bg-white text-gray-800">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="text-black font-semibold uppercase tracking-[4px] mb-3">
              About Exclusive
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Discover a Better Way
              <br />
              <span className="text-black">
                to Shop Online
              </span>
            </h1>

            <p className="text-gray-600 leading-8 text-lg mb-8">
              Exclusive is a modern eCommerce platform dedicated to providing
              premium products, affordable prices, and an exceptional shopping
              experience. We believe online shopping should be simple, secure,
              and enjoyable for everyone.
            </p>
<button
  onClick={() => navigate("/products")}
  className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300"
>
  Shop Now
</button>
            
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200"
              alt="Exclusive"
              className="rounded-2xl shadow-xl object-cover w-full h-[550px]"
            />
          </div>

        </div>
      </section>

      {/* Story */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200"
            alt="Our Story"
            className="rounded-2xl shadow-lg"
          />

          <div>
            <h2 className="text-4xl font-bold mb-8">
              Our Story
            </h2>

            <p className="text-gray-600 leading-8 mb-6">
              Founded with the vision of making online shopping easier and more
              enjoyable, Exclusive has become a trusted destination for
              customers looking for quality products at competitive prices.
            </p>

            <p className="text-gray-600 leading-8 mb-6">
              From fashion and electronics to home essentials, we carefully
              select every product to ensure our customers receive the best
              value for their money.
            </p>

            <p className="text-gray-600 leading-8">
              Every order reflects our commitment to quality, trust, innovation,
              and customer satisfaction.
            </p>
          </div>

        </div>
      </section>

      {/* Statistics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {stats.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl p-10 text-center hover:shadow-xl hover:-translate-y-2 duration-300"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon size={30} className="text-black" />
                </div>

                <h3 className="text-4xl font-bold mb-2">
                  {item.value}
                </h3>

                <p className="text-gray-500">
                  {item.label}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">

            <p className="uppercase tracking-[3px] font-semibold text-black">
              Why Choose Us
            </p>

            <h2 className="text-4xl font-bold mt-4 mb-5">
              We Make Shopping Easy
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto leading-8">
              Everything we do is designed to give you a fast, secure, and
              enjoyable shopping experience.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-8 hover:border-black hover:shadow-xl duration-300"
              >

                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <service.icon size={30} className="text-black" />
                </div>

                <h3 className="text-2xl font-semibold mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-8">
                  {service.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* Testimonial */}
      <section className="bg-black py-24 mb-88">

        <div className="max-w-4xl mx-auto px-6 text-center text-white">

          <Star
            size={55}
            className="mx-auto mb-8 fill-white"
          />

          <h2 className="text-4xl font-bold mb-8">
            Trusted by Thousands of Customers
          </h2>

          <p className="text-gray-300 text-lg leading-9">
            "Exclusive has completely transformed the way I shop online.
            Everything from the product quality to the delivery speed is
            outstanding. I highly recommend Exclusive to anyone looking for a
            reliable online shopping experience."
          </p>

          <div className="mt-10">
            <h4 className="font-semibold text-xl">
              Sarah Johnson
            </h4>

            <p className="text-gray-400">
              Loyal Customer
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default About;