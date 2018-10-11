using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        [HttpGet("{id}")]
        public ItemInfo Get(string id)
        {
            var itemInfo = new ItemInfo
            {
                Id = id,
                Description = $"Description for {id}",
                Cost = 45.57M
            };
            return itemInfo;
        }

        public class ItemInfo
        {
            public string Id { get; set; }
            public string Description { get; set; }
            public decimal Cost { get; set;}
        }
    }
}
