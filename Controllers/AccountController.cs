﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NG_Core_Auth.Helpers;
using NG_Core_Auth.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NG_Core_Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly AppSettings _appSettings;
        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IOptions<AppSettings> appSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _appSettings = appSettings.Value;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register ([FromBody] RegisterViewModel formData)
        {
            //Will hold all the error related to registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = formData.Email,
                UserName = formData.Username,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, formData.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Customer");

                //Sending confirmation email

                return Ok(new { username = user.UserName, email = user.Email, status = 1, message = "Registration Suceedeed madafocker!" });
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);
                }
            }

            return BadRequest(new JsonResult(errorList));
        }

        //Login Mwthod
        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel formData)
        {
            //Get the user from database
            var user = await _userManager.FindByNameAsync(formData.Username);
            var roles = await _userManager.GetRolesAsync(user);
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));
            double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

            if (user!=null && await _userManager.CheckPasswordAsync(user, formData.Password))
            {
                //Confirmation of email

                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, formData.Username),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.Now.ToString())
                    }),
                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _appSettings.Site,
                    Audience = _appSettings.Audience,
                    Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
                };

                //Generate the token and send it back to the client
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo, userName = user.UserName, userRole = roles.FirstOrDefault() });
            }

            //Return error
            ModelState.AddModelError("", "Username/Password was not found!");
            return Unauthorized(new { Loginerror = "Please check the login credentials - Invalid Username/Password was entered" });
        }
    }
}
