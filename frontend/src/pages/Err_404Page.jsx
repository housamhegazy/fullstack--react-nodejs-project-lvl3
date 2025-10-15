import React from "react";
import { useRouteError } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";

const Err_404Page = () => {
  const error = useRouteError();
  // console.error("Route Error Details:", error); // يمكنك إبقاؤها لتصحيح الأخطاء
  const theme = useTheme(); // 💡 الوصول إلى الثيم الحالي
  //============================================
  let title = "الصفحة غير موجودة (404)";
  let detailMessage = "نأسف، لا يوجد مسار يطابق طلبك. تأكد من صحة العنوان.";
  let statusDisplay = "404 🚫";
  let isNotFoundError = true;

  // 💡 التحقق: إذا كان هناك خطأ مُمرَّر، فهذا ليس خطأ 404 للمسار، بل هو خطأ في الكود/الـ Loader
  if (error) {
    isNotFoundError = false;
    // @ts-ignore
    statusDisplay = error.status && error.status !== 404 ? error.status : "خطأ";
    title = "حدث خطأ أثناء تحميل الصفحة! 🛑";

    // محاولة استخراج رسالة الخطأ
    let errorMessage =
      error && typeof error === "object" && "message" in error
        ? error.message
        : error && typeof error === "object" && "statusText" in error
        ? error.statusText
        : "حدث خطأ غير متوقع في جلب البيانات.";

    detailMessage = `التفاصيل الفنية: ${errorMessage}`;
  }

  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 8,
        p: 3,
        backgroundColor: isNotFoundError && theme.palette.background.default,
        borderRadius: 2,
        border: `1px solid ${
          isNotFoundError
            ? theme.palette.primary.light
            : theme.palette.primary.dark
        }`,
      }}
    >
      <Typography
        variant="h1"
        color={isNotFoundError && theme.palette.text.primary}
        gutterBottom
      >
        {statusDisplay}
      </Typography>

      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      {/* عرض الرسالة المناسبة للحالة */}
      <Typography
        variant="body1"
        sx={{ mt: 2, color: isNotFoundError && theme.palette.text.primary }}
      >
        {detailMessage}
      </Typography>

      {!isNotFoundError && (
        <Typography
          variant="body2"
          sx={{ mt: 4, color: theme.palette.text.primary }}
        >
          يرجى محاولة تحديث الصفحة أو العودة إلى الصفحة الرئيسية.
        </Typography>
      )}
    </Box>
  );
};

export default Err_404Page;
