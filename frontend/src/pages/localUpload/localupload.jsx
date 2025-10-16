import LoadingPage from "../../components/loading/loadingPage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetUserProfileQuery } from "../../Redux/userApi";
import Swal from "sweetalert2";
import LocalUploadData from "./localUploadData";
// import { useState } from "react";
const LocalUpload = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: userLoading,
    isError,
  } = useGetUserProfileQuery(); // Fetch current user
  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [allImgs, setAllImgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const getLastImg = async () => {
    const userId = user._id
    await fetch(`http://localhost:3000/api/lastpic/${userId}`, {
      method: "GET",
      credentials: "include",
    })
      .then( (res) => {
        // 💡 1. التحقق من حالة الاستجابة أولاً
        if (!res.ok) {
          // إذا فشلت، نحاول قراءة JSON الخطأ (لو كان موجوداً)
          try {
            const errorData =  res
              .json();
            throw new Error(
              errorData.message ||
              `Failed to fetch last image with status: ${res.status}`
            );
          } catch {
            throw new Error(
              `Failed to fetch last image: HTTP Status ${res.status}`
            );
          }
        }
        return res.json();
      })
      .then((data) => {
        // 💡 2. التحقق من وجود البيانات قبل التحديث
        if (data && data.imageUrl) {
          setPreview(`${data.imageUrl}`);
        }
      })
      .catch((err) => {
        // 💡 3. استخدام console.error
        console.error(err.message + " error from get last image");
      });
  };

  const getAllimgs = async () => {
    setLoading(true);
    
    await fetch(`http://localhost:3000/api/allpic/${user._id}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        // 💡 1. التحقق من حالة الاستجابة أولاً
        if (!res.ok) {
          // إذا فشلت، نحاول قراءة JSON الخطأ (لو كان موجوداً)
          try {
            const errorData = await res
              .json();
            throw new Error(
              errorData.message ||
              `Failed to fetch all images with status: ${res.status}`
            );
          } catch {
            throw new Error(
              `Failed to fetch all images: HTTP Status ${res.status}`
            );
          }
        }
        return res.json();
      })
      .then((data) => {
        // 💡 2. التحقق من وجود البيانات قبل التحديث
        if (data && data.images) {
          setAllImgs(data.images);
        }
      })
      .catch((error) => console.error(error.message + " error loading images")) // 💡 3. استخدام console.error
      .finally(() => setLoading(false));
  };
  // 📥 تحميل آخر صورة محفوظة عند فتح الصفحة

  useEffect(() => {
    if (!user && !userLoading) {
      navigate("/signin", { replace: true });
      return;
    }

    if (userLoading) {
      return;
    }
    // 3. إذا أصبح user جاهزاً (user موجود وغير userLoading)
    if (user && user._id) {
      getLastImg();
      getAllimgs();
    }
  }, [navigate, user, userLoading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("من فضلك اختر صورة أولًا");
      return;
    }

    //تخزين داتا الفورم
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("myfile", selectedFile);

    setLoading(true);
    //ارسالها للباك اند

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("http://localhost:3000/api/uploadpic", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message + "حدث خطأ" || "حدث خطأ أثناء الرفع");
        getLastImg();
          getAllimgs();
        Swal.fire({
          title: "added!",
          text: "Your image has added successfully.",
          icon: "success",
        });

         
      } catch (err) {
        console.error(err);
        setError(err.message + "error uploading image");
      } finally {
        setLoading(false);
        setSelectedFile(null);
      }
    }
  };

  const handledelete = async (image) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:3000/api/deleteImage/${image}/${user._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء الحذف");
        // تحديث الصور بعد الحذف
        
        Swal.fire({
          title: "Deleted!",
          text: "Your image has been deleted.",
          icon: "success",
        });
          getLastImg(); 
         getAllimgs();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // تأكد من عرض شاشة التحميل في الدالة الرئيسية:
  if (userLoading) {
    return <LoadingPage mode={undefined} />;
  }
  return (
    <LocalUploadData
      {...{
        handleFileChange,
        handlesubmit,
        allImgs,
        preview,
        error,
        handledelete,
        loading,
      }}
    />

  );
};

export default LocalUpload;
