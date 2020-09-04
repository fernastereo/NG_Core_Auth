using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NG_Core_Auth.Data;
using NG_Core_Auth.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NG_Core_Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _Db;

        public ProductController(ApplicationDbContext Db)
        {
            _Db = Db;
        }

        // GET: api/<ProductController>
        [HttpGet("[action]")]
        public IActionResult GetProducts()
        {
            return Ok(_Db.Products.ToList());
        }

        // POST api/<ProductController>
        [HttpPost("[action]")]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel formData)
        {
            var newProduct = new ProductModel
            {
                Name = formData.Name,
                ImageUrl = formData.ImageUrl,
                Description = formData.Description,
                OutOfStock = formData.OutOfStock,
                Price = formData.Price
            };

            await _Db.Products.AddAsync(newProduct);

            await _Db.SaveChangesAsync();

            return Ok();
        }

        // PUT api/<ProductController>/5
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] ProductModel formData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findProduct = _Db.Products.FirstOrDefault(p => p.ProductId == id);

            if (findProduct == null)
            {
                return NotFound();
            }

            //if the product was found 
            findProduct.Name = formData.Name;
            findProduct.ImageUrl = formData.ImageUrl;
            findProduct.Description = formData.Description;
            findProduct.OutOfStock = formData.OutOfStock;
            findProduct.Price = formData.Price;

            _Db.Entry(findProduct).State = EntityState.Modified;

            await _Db.SaveChangesAsync();

            return Ok(new JsonResult("The product with id " + id + " was updated"));
        }

        // DELETE api/<ProductController>/5
        [HttpDelete("[action]")]
        public async Task<IActionResult> deleteProduct([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var findProduct = await _Db.Products.FindAsync(id); //a different way to search for a product

            if (findProduct == null)
            {
                return NotFound();
            }

            //if the product was found 
            _Db.Products.Remove(findProduct);

            await _Db.SaveChangesAsync();

            return Ok(new JsonResult("The product with id " + id + " was deleted"));
        }
    }
}
