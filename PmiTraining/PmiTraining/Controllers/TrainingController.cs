using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcPMITrainingApp.ViewModels;

namespace MvcPmiTrainingApp.Controllers
{
    [AllowCrossSiteJson]
    public class TrainingController : Controller
    {
        //
        // GET: /PhoneBook/
        public ActionResult Index()
        {

            return View();
        }

        public ActionResult StudentDetails(int id)
        {
            ViewBag.StudentId = id;
            return View();
        }

        public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
                base.OnActionExecuting(filterContext);
            }
        }

    }
}
