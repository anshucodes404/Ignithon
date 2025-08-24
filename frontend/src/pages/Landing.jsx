import React from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Heart, Users, Shield, Phone, Mail, Map } from "lucide-react";

const Landing = () => {
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/hero-bg.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8"></div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#FFD700] mb-8 leading-tight">
            "भूख से बड़ी कोई problem नहीं,
            <br />
            और दान से बड़ा कोई solution नहीं"
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium">
            Connecting communities to end hunger, one meal at a time
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report-issue">
              <Button
                size="lg"
                className="bg-[#518d4f] hover:bg-[#195319] text-white px-8 py-4 text-lg"
              >
                Report Food Shortage
              </Button>
            </Link>
            <Link href="/donate">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#195319] px-8 py-4 text-lg bg-transparent"
              >
                Donate Food
              </Button>
            </Link>
            <Link href="/map">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#195319] px-8 py-4 text-lg bg-transparent"
              >
                <Map className="w-5 h-5 mr-2" />
                Explore Map
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* pictures and videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* <!-- 1. Video + Description --> */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <video autoPlay muted loop controls className="w-full rounded-lg mb-3">
            <source src="./video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="text-gray-700">
            Don’t let their sweat go to waste — support our Farmers on अन्नSeva.
            Every meal saved is a step toward Zero Hunger.
          </p>
        </div>

      


      <div >
        {/* <!-- 1. Video + Description --> */}
        <div id="myDiv" className="bg-white shadow-lg rounded-2xl p-4">
          <video autoPlay muted loop controls className="w-full rounded-lg mb-3">
            <source src="./video2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div id="myDiv">Hello</div>

        <script>
          let div = document.getElementById("myDiv");
          div.style.width = "400px";
          div.style.height = "400px";
        </script>
          <p className="text-gray-700">
            "Every click feeds a life. With अन्नSeva, food donated by NGOs
            reaches empty plates—because no one deserves to sleep hungry." 🍛❤
            #ZeroHunger #अन्नSev #FoodForAl
          </p>
        </div>
      <br />
      
         <div className="bg-white shadow-lg rounded-2xl p-4">
          <div className="flex gap-2 mb-3">
            <img src="./pic1.jpg" alt="pic1" className="w-1/2 rounded-lg" />
          </div>
          <p className="text-gray-700">
            These images showcase how donors can choose areas with food
            shortages and make contributions directly.
          </p>
        </div>
      </div>
    </div> 

      {/* Why Us Section */}
      <section id="why-us" className="py-20 bg-[#d6efd9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#195319] mb-4">
              Why Choose अन्न Seva?
            </h2>
            <p className="text-xl text-[#518d4f] max-w-3xl mx-auto">
              We bridge the gap between food surplus and shortage through
              technology and community collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-[#80af81] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#518d4f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#195319] mb-2">
                  Fast Response
                </h3>
                <p className="text-[#518d4f]">
                  Quick verification and response to food shortage reports
                  within 24 hours
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-[#80af81] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#518d4f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#195319] mb-2">
                  Verified NGOs
                </h3>
                <p className="text-[#518d4f]">
                  Partner with trusted, verified NGOs and food suppliers in your
                  area
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-[#80af81] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#518d4f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#195319] mb-2">
                  Nearby Matching
                </h3>
                <p className="text-[#518d4f]">
                  Smart location-based matching within 2km radius for efficient
                  distribution
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-[#80af81] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#518d4f] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#195319] mb-2">
                  Transparent Process
                </h3>
                <p className="text-[#518d4f]">
                  Complete transparency in donation tracking and food
                  distribution
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="mt-3 bg-white rounded-2xl p-8 md:p-12 shadow-lg mx-8 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-forest-green">
              1000+
            </div>
            <div className="text-medium-olive font-medium">Families Helped</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-forest-green">
              50+
            </div>
            <div className="text-medium-olive font-medium">Partner NGOs</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-forest-green">
              24/7
            </div>
            <div className="text-medium-olive font-medium">
              Support Available
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-16 mx-8 mb-8">
        <div className="bg-[#195319] rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join our community of changemakers and help us create a world where
            no one goes hungry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#ffd700] backdrop-blur-sm text-[#195319] border-2 border-white/30 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-colors">
              Become a Volunteer
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#195319] mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-[#518d4f]">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-[#195319] mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#518d4f]" />
                  <span className="text-[#518d4f]">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#518d4f]" />
                  <span className="text-[#518d4f]">contact@annseva.org</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#518d4f]" />
                  <span className="text-[#518d4f]">New Delhi, India</span>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" placeholder="Your full name" />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Your message"
                    rows={4}
                  />
                </div>
                <Button className="w-full bg-[#518d4f] hover:bg-[#195319]">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-forest-green text-white bg-[#195319] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-14 h-w-14 bg-warm-yellow rounded-full flex items-center justify-center">
                  <img width="250" height="250" src="./logo.png" alt="logo" />
                </div>
                <span className="font-semibold text-xl">अन्न Seva</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                Connecting hearts, sharing meals, and building a hunger-free
                community one donation at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="#why-us"
                  className="block text-white/80 hover:text-warm-yellow transition-colors"
                >
                  Why Choose Us
                </a>
                <a
                  href="#contact"
                  className="block text-white/80 hover:text-warm-yellow transition-colors"
                >
                  Contact Us
                </a>
                <button className="block text-white/80 hover:text-warm-yellow transition-colors text-left">
                  Raise an Issue
                </button>
                <button className="block text-white/80 hover:text-warm-yellow transition-colors text-left">
                  Donate Now
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Get in Touch</h4>
              <div className="space-y-2 text-white/80">
                <p>Email: annseva@seva.com</p>
                <p>Phone: +91 95086 24022</p>
                <p>KIIT, Odisha, India</p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/80 flex items-center justify-center gap-2">
              Made with <Heart size={16} className="text-yellow-400" /> by
              HackerEyes for a hunger-free world
            </p>
            <p className="text-white/60 text-sm mt-2">
              © 2025 अन्न Seva. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Landing;
